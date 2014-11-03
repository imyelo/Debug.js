#debug

## Usage
```
var debug = require('debug')('cinema');
debug('foo', 'bar');
```

## API
### print
```
  Debug(name, [withTrace])(obj, [obj, ...])
```

### enable
```
  Debug.enable()
```

### disable
```
  Debug.disable()
  Debug.disable(name, [name, ...])
```

### only
```
  Debug.only(name, [name, ...])
```

### isEnabled
```
  Debug.isEnabled()
```

### License
MIT