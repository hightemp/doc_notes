(window.webpackJsonp=window.webpackJsonp||[]).push([[141],{414:function(n,_,t){"use strict";t.r(_);var s=t(14),p=Object(s.a)({},(function(){var n=this,_=n._self._c;return _("ContentSlotsDistributor",{attrs:{"slot-key":n.$parent.slotKey}},[_("p",[n._v("http://parallels.nsu.ru/~fat/unixsvr4-new/trunk/%D0%9B%D0%B5%D0%BA%D1%86%D0%B8%D1%8F%2010%20-%20%D0%A1%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20System%20V%20IPC.pdf")]),n._v(" "),_("p",[n._v("ЦЕЛИ РАЗДЕЛА\n• иметь представление об общих свойствах – семафоров – разделяемой памяти – очередей сообщений\n• использовать ключ для получения доступа к средствам IPC\n• получать информацию о средствах IPC и удалять их с использованием команд")]),n._v(" "),_("p",[n._v("СРЕДСТВА МЕЖПРОЦЕССНОГО ВЗАИМОДЕЙСТВИЯ\n• разделяемая память\n• семафоры\n• очереди сообщений")]),n._v(" "),_("p",[n._v("ОБЩИЕ СВОЙСТВА СРЕДСТВ IPC\n• Средства могут быть созданы за любое время до их использования\n• В момент создания для средства IPC устанавливаются собственность и права доступа, которые могут позднее быть изменены\n• Содержимое средства IPC может сохраняться после того, как все использовавшие его процессы завершились.\n• Средства должны удаляться явным образом, командой или соответствующим системным вызовом\n• Средства IPC теряются при перезагрузке системы.")]),n._v(" "),_("p",[n._v("get — основные сведения\n• создатель задает IPC_CREAT и права доступа в параметре flg\n• создатель может дополнительно задать IPC_EXCL\n• существуют права чтения (r) и записи (w) для хозяина, группы и других пользователей.\n• параметры настройки системы задают ограничения\n• после создания средства IPC, устанавливается взаимно однозначное соответствие между ненулевым ключом и id\n• IPC_PRIVATE предоставляет приватный ключ")]),n._v(" "),_("p",[n._v("ctl — основные сведения\nIPC_STAT - получает информацию о состоянии\nIPC_SET - изменяет хозяина или права доступа\nIPC_RMID - удаляет средство")]),n._v(" "),_("p",[n._v("КОМАНДЫ ipcs(1) И ipcrm(1)\n• состояние всех существующих в данный момент средств IPC - ipcs(1)\n• удаление средства IPC - ipcrm(1)")]),n._v(" "),_("p",[n._v("ОЧЕРЕДИ СООБЩЕНИЙ\nmsgget - создать очередь или получить к ней доступ\nmsgctl - определить состояние очереди; изменить хозяина или права доступа к ней; изменить максимальный размер очереди или удалить ее\nmsgop - послать (msgsnd) или получить (msgrcv) сообщение")]),n._v(" "),_("p",[n._v("СЕМАФОРЫ\n• Разделяемое короткое беззнаковое целое значение\n• Используется для:\n– блокировки\n– управления доступом к ресурсам\n– подсчета\n– разделения небольшого беззнакового значения между процессами")]),n._v(" "),_("p",[n._v("ВОЗВРАЩАЕМОЕ ЗНАЧЕНИЕ\nGETVAL - значение семафора\nGETPID - идентификатор процесса, совершившего последнюю операцию над семафором\nGETNCNT - количество процессов, ожидающих увеличения значения семафора по сравнению с текущим значением\nGETZCNT - количество процессов, ожидающих нулевого значения семафора неуспех - -1 и errno установлена")]),n._v(" "),_("p",[n._v("Флаги\n• IPC_NOWAIT – неблокирующаяся операция\n• SEM_UNDO – отмена операции над семафором при завершении программы")]),n._v(" "),_("p",[n._v("РАЗДЕЛЯЕМАЯ ПАМЯТЬ\n• shmget - создать или получить доступ к сегменту разделяемой памяти\n• shmctl - определить состояние разделяемого сегмента; изменить хозяина/группу сегмента и права доступа; удалить сегмент\n• shmop - присоединить (shmat) разделяемый сегмент к области данных процесса, или отсоединить его (shmdt)")])])}),[],!1,null,null,null);_.default=p.exports}}]);