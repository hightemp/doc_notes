## AttributeError: 'NoneType' object has no attribute 'device'

Try this:

**in** text-generation-webui/modules/LoRA.py **uncomment** line 20 by removing the # sign.

It should go from

```
#params['device_map'] = {'': 0} 
```
to
```
params['device_map'] = {'': 0}
```

Save, restart the web UI, and try loading the LoRA again.

