https://pytorch.org/tutorials/intermediate/ddp_tutorial.html

[DistributedDataParallel](https://pytorch.org/docs/stable/nn.html#torch.nn.parallel.DistributedDataParallel) (DDP) реализует параллелизм данных на уровне модулей, который может выполняться на нескольких компьютерах. Приложения, использующие DDP, должны порождать несколько процессов и создавать один экземпляр DDP для каждого процесса. DDP использует коллективные коммуникации в пакете [torch.distributed](https://pytorch.org/tutorials/intermediate/dist_tuto.html) для синхронизации градиентов и буферов. В частности, DDP регистрирует хук автоградации для каждого параметра, заданного параметром, `model.parameters()`и хук срабатывает, когда соответствующий градиент вычисляется в обратном проходе. Затем DDP использует этот сигнал для запуска градиентной синхронизации между процессами. Дополнительные сведения см. в [примечаниях к дизайну DDP .](https://pytorch.org/docs/master/notes/ddp.html)

Рекомендуемый способ использования DDP — создание одного процесса для каждой реплики модели, при этом реплика модели может охватывать несколько устройств. Процессы DDP можно размещать на одном и том же компьютере или на нескольких компьютерах, но устройства GPU не могут быть общими для процессов. Это руководство начинается с базового варианта использования DDP, а затем демонстрирует более сложные варианты использования, включая модели с контрольными точками и объединение DDP с параллельными моделями.

ПРИМЕЧАНИЕ

Код в этом руководстве выполняется на сервере с 8 графическими процессорами, но его можно легко обобщить на другие среды.

## Сравнение между `DataParallel`и`DistributedDataParallel`[](https://pytorch.org/tutorials/intermediate/ddp_tutorial.html#comparison-between-dataparallel-and-distributeddataparallel)

Прежде чем мы углубимся, давайте проясним, почему, несмотря на дополнительную сложность, вы можете использовать `DistributedDataParallel`over `DataParallel`:

-   Во-первых, `DataParallel`это однопроцессный, многопоточный и работает только на одной машине, тогда как `DistributedDataParallel`он многопроцессный и работает как для одно-, так и для многомашинного обучения. `DataParallel`обычно медленнее, чем `DistributedDataParallel`даже на одной машине, из-за соперничества GIL между потоками, реплицированной модели для каждой итерации и дополнительных накладных расходов, связанных с разбрасыванием входных данных и сбором выходных данных.
    
-   Напомним из [предыдущего руководства](https://pytorch.org/tutorials/intermediate/model_parallel_tutorial.html) , что если ваша модель слишком велика для одного GPU, вы должны использовать **параллельную модель** , чтобы разделить ее на несколько GPU. `DistributedDataParallel`работает с **моделью параллельно** ; `DataParallel`в это время нет. Когда DDP сочетается с модельным параллелизмом, каждый процесс DDP будет использовать модельный параллелизм, а все процессы в совокупности будут использовать параллелизм данных.
    
-   Если ваша модель должна охватывать несколько компьютеров или если ваш вариант использования не соответствует парадигме параллелизма данных, см. [RPC API](https://pytorch.org/docs/stable/rpc.html) для более общей поддержки распределенного обучения.
    

## Базовый вариант использования[](https://pytorch.org/tutorials/intermediate/ddp_tutorial.html#basic-use-case)

Чтобы создать модуль DDP, вы должны сначала правильно настроить группы процессов. Более подробную информацию можно найти в [Написание распределенных приложений с помощью PyTorch](https://pytorch.org/tutorials/intermediate/dist_tuto.html) .

import os
import sys
import tempfile
import torch
import torch.distributed as dist
import torch.nn as nn
import torch.optim as optim
import torch.multiprocessing as mp

from torch.nn.parallel import DistributedDataParallel as DDP

# On Windows platform, the torch.distributed package only
# supports Gloo backend, FileStore and TcpStore.
# For FileStore, set init_method parameter in init_process_group
# to a local file. Example as follow:
# init_method="file:///f:/libtmp/some_file"
# dist.init_process_group(
#    "gloo",
#    rank=rank,
#    init_method=init_method,
#    world_size=world_size)
# For TcpStore, same way as on Linux.

def setup(rank, world_size):
    os.environ['MASTER_ADDR'] = 'localhost'
    os.environ['MASTER_PORT'] = '12355'

    # initialize the process group
    dist.init_process_group("gloo", rank=rank, world_size=world_size)

def cleanup():
    dist.destroy_process_group()

Теперь давайте создадим игрушечный модуль, обернем его DDP и скормим ему фиктивные входные данные. Обратите внимание, что поскольку DDP передает состояния модели от процесса ранга 0 всем остальным процессам в конструкторе DDP, вам не нужно беспокоиться о том, что разные процессы DDP начинаются с разных начальных значений параметров модели.

class ToyModel(nn.Module):
    def __init__(self):
        super(ToyModel, self).__init__()
        self.net1 = nn.Linear(10, 10)
        self.relu = nn.ReLU()
        self.net2 = nn.Linear(10, 5)

    def forward(self, x):
        return self.net2(self.relu(self.net1(x)))

def demo_basic(rank, world_size):
    print(f"Running basic DDP example on rank {rank}.")
    setup(rank, world_size)

    # create model and move it to GPU with id rank
    model = ToyModel().to(rank)
    ddp_model = DDP(model, device_ids=[rank])

    loss_fn = nn.MSELoss()
    optimizer = optim.SGD(ddp_model.parameters(), lr=0.001)

    optimizer.zero_grad()
    outputs = ddp_model(torch.randn(20, 10))
    labels = torch.randn(20, 5).to(rank)
    loss_fn(outputs, labels).backward()
    optimizer.step()

    cleanup()

def run_demo(demo_fn, world_size):
    mp.spawn(demo_fn,
             args=(world_size,),
             nprocs=world_size,
             join=True)

Как видите, DDP оборачивает детали распределенной связи более низкого уровня и предоставляет чистый API, как если бы это была локальная модель. Связь с синхронизацией градиента происходит во время обратного прохода и перекрывается с обратным вычислением. Когда `backward()`возвращается, `param.grad`уже содержит синхронизированный тензор градиента. В базовых случаях использования DDP требуется всего несколько дополнительных LoC для настройки группы процессов. При применении DDP к более сложным случаям использования следует соблюдать некоторые предостережения.

## Неравномерная скорость обработки[](https://pytorch.org/tutorials/intermediate/ddp_tutorial.html#skewed-processing-speeds)

В DDP конструктор, прямой и обратный проходы являются распределенными точками синхронизации. Предполагается, что разные процессы запускают одинаковое количество синхронизаций, достигают этих точек синхронизации в одном и том же порядке и входят в каждую точку синхронизации примерно в одно и то же время. В противном случае быстрые процессы могут прибыть раньше и превысить время ожидания отставших. Следовательно, пользователи несут ответственность за балансировку распределения рабочей нагрузки между процессами. Иногда перекосы в скорости обработки неизбежны, например, из-за сетевых задержек, конфликтов за ресурсы или непредсказуемых скачков рабочей нагрузки. Чтобы избежать тайм-аутов в таких ситуациях, убедитесь, что вы передаете достаточно большое `timeout`значение при вызове [init_process_group](https://pytorch.org/docs/stable/distributed.html#torch.distributed.init_process_group) .

## Сохранение и загрузка контрольных точек[](https://pytorch.org/tutorials/intermediate/ddp_tutorial.html#save-and-load-checkpoints)

`torch.save`Модули и `torch.load`контрольные точки обычно используются во время обучения и восстановления после контрольных точек. Подробнее см. в [разделе СОХРАНЕНИЕ И ЗАГРУЗКА МОДЕЛЕЙ .](https://pytorch.org/tutorials/beginner/saving_loading_models.html) При использовании DDP одной из оптимизаций является сохранение модели только в одном процессе, а затем загрузка ее во все процессы, что снижает накладные расходы на запись. Это правильно, потому что все процессы начинаются с одних и тех же параметров, а градиенты синхронизируются в обратных проходах, и, следовательно, оптимизаторы должны продолжать устанавливать для параметров одни и те же значения. Если вы используете эту оптимизацию, убедитесь, что ни один процесс не начнет загружаться до завершения сохранения. Кроме того, при загрузке модуля необходимо предоставить соответствующий `map_location` аргумент, чтобы предотвратить доступ процесса к чужим устройствам. Если `map_location` отсутствует,`torch.load`сначала загрузит модуль в ЦП, а затем скопирует каждый параметр туда, где он был сохранен, что приведет к тому, что все процессы на одной машине будут использовать один и тот же набор устройств. Дополнительные сведения о восстановлении после сбоев и поддержке эластичности см. в [TorchElastic](https://pytorch.org/elastic) .

def demo_checkpoint(rank, world_size):
    print(f"Running DDP checkpoint example on rank {rank}.")
    setup(rank, world_size)

    model = ToyModel().to(rank)
    ddp_model = DDP(model, device_ids=[rank])

    CHECKPOINT_PATH = tempfile.gettempdir() + "/model.checkpoint"
    if rank == 0:
        # All processes should see same parameters as they all start from same
        # random parameters and gradients are synchronized in backward passes.
        # Therefore, saving it in one process is sufficient.
        torch.save(ddp_model.state_dict(), CHECKPOINT_PATH)

    # Use a barrier() to make sure that process 1 loads the model after process
    # 0 saves it.
    dist.barrier()
    # configure map_location properly
    map_location = {'cuda:%d' % 0: 'cuda:%d' % rank}
    ddp_model.load_state_dict(
        torch.load(CHECKPOINT_PATH, map_location=map_location))

    loss_fn = nn.MSELoss()
    optimizer = optim.SGD(ddp_model.parameters(), lr=0.001)

    optimizer.zero_grad()
    outputs = ddp_model(torch.randn(20, 10))
    labels = torch.randn(20, 5).to(rank)

    loss_fn(outputs, labels).backward()
    optimizer.step()

    # Not necessary to use a dist.barrier() to guard the file deletion below
    # as the AllReduce ops in the backward pass of DDP already served as
    # a synchronization.

    if rank == 0:
        os.remove(CHECKPOINT_PATH)

    cleanup()

## Сочетание DDP с параллелизмом моделей[](https://pytorch.org/tutorials/intermediate/ddp_tutorial.html#combining-ddp-with-model-parallelism)

DDP также работает с моделями с несколькими графическими процессорами. DDP-обёртка моделей с несколькими GPU особенно полезна при обучении больших моделей с огромным объёмом данных.

class ToyMpModel(nn.Module):
    def __init__(self, dev0, dev1):
        super(ToyMpModel, self).__init__()
        self.dev0 = dev0
        self.dev1 = dev1
        self.net1 = torch.nn.Linear(10, 10).to(dev0)
        self.relu = torch.nn.ReLU()
        self.net2 = torch.nn.Linear(10, 5).to(dev1)

    def forward(self, x):
        x = x.to(self.dev0)
        x = self.relu(self.net1(x))
        x = x.to(self.dev1)
        return self.net2(x)

При передаче модели с несколькими графическими процессорами в DDP `device_ids`НЕ `output_device` ДОЛЖЕН устанавливаться. Входные и выходные данные будут помещены в соответствующие устройства либо приложением, либо `forward()`методом модели.

def demo_model_parallel(rank, world_size):
    print(f"Running DDP with model parallel example on rank {rank}.")
    setup(rank, world_size)

    # setup mp_model and devices for this process
    dev0 = (rank * 2) % world_size
    dev1 = (rank * 2 + 1) % world_size
    mp_model = ToyMpModel(dev0, dev1)
    ddp_mp_model = DDP(mp_model)

    loss_fn = nn.MSELoss()
    optimizer = optim.SGD(ddp_mp_model.parameters(), lr=0.001)

    optimizer.zero_grad()
    # outputs will be on dev1
    outputs = ddp_mp_model(torch.randn(20, 10))
    labels = torch.randn(20, 5).to(dev1)
    loss_fn(outputs, labels).backward()
    optimizer.step()

    cleanup()

if __name__ == "__main__":
    n_gpus = torch.cuda.device_count()
    assert n_gpus >= 2, f"Requires at least 2 GPUs to run, but got {n_gpus}"
    world_size = n_gpus
    run_demo(demo_basic, world_size)
    run_demo(demo_checkpoint, world_size)
    run_demo(demo_model_parallel, world_size)

## Инициализируйте DDP с помощью torch.distributed.run/torchrun[](https://pytorch.org/tutorials/intermediate/ddp_tutorial.html#initialize-ddp-with-torch-distributed-run-torchrun)

Мы можем использовать PyTorch Elastic, чтобы упростить код DDP и упростить инициализацию задания. Давайте все же воспользуемся примером Toymodel и создадим файл с именем `elastic_ddp.py`.

import torch
import torch.distributed as dist
import torch.nn as nn
import torch.optim as optim

from torch.nn.parallel import DistributedDataParallel as DDP

class ToyModel(nn.Module):
    def __init__(self):
        super(ToyModel, self).__init__()
        self.net1 = nn.Linear(10, 10)
        self.relu = nn.ReLU()
        self.net2 = nn.Linear(10, 5)

    def forward(self, x):
        return self.net2(self.relu(self.net1(x)))

def demo_basic():
    dist.init_process_group("nccl")
    rank = dist.get_rank()
    print(f"Start running basic DDP example on rank {rank}.")

    # create model and move it to GPU with id rank
    device_id = rank % torch.cuda.device_count()
    model = ToyModel().to(device_id)
    ddp_model = DDP(model, device_ids=[device_id])

    loss_fn = nn.MSELoss()
    optimizer = optim.SGD(ddp_model.parameters(), lr=0.001)

    optimizer.zero_grad()
    outputs = ddp_model(torch.randn(20, 10))
    labels = torch.randn(20, 5).to(device_id)
    loss_fn(outputs, labels).backward()
    optimizer.step()

if __name__ == "__main__":
    demo_basic()

Затем можно запустить команду [`torch elastic/torchrun<https://pytorch.org/docs/stable/elastic/quickstart.html>`__](https://pytorch.org/tutorials/intermediate/ddp_tutorial.html#id1) на всех узлах, чтобы инициализировать задание DDP, созданное выше:

torchrun --nnodes=2 --nproc_per_node=8 --rdzv_id=100 --rdzv_backend=c10d --rdzv_endpoint=$MASTER_ADDR:29400 elastic_ddp.py

Мы запускаем сценарий DDP на двух хостах, и на каждом хосте мы запускаем 8 процессов, то есть мы запускаем его на 16 графических процессорах. Обратите внимание, что они `$MASTER_ADDR`должны быть одинаковыми для всех узлов.

Здесь torchrun запустит 8 процессов и вызовет `elastic_ddp.py` каждый процесс на узле, на котором он запущен, но пользователю также необходимо применить инструменты управления кластером, такие как slurm, чтобы фактически запустить эту команду на 2 узлах.

Например, в кластере с поддержкой SLURM мы можем написать скрипт для запуска приведенной выше команды и установить его `MASTER_ADDR`как:

export MASTER_ADDR=$(scontrol show hostname ${SLURM_NODELIST} | head -n 1)

Затем мы можем просто запустить этот скрипт с помощью команды SLURM: . Конечно, это всего лишь пример; вы можете выбрать свои собственные инструменты планирования кластера, чтобы инициировать задание torchrun.`srun --nodes=2 ./torchrun_script.sh`

Для получения дополнительной информации об эластичном беге можно проверить этот [документ с кратким руководством](https://pytorch.org/docs/stable/elastic/quickstart.html) , чтобы узнать больше.