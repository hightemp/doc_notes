Add Binary FileSystem and Multiple Template Renderer

**Add Binary FileSystem**

> go get -u github.com/jteeuwen/go-bindata/…  
> go get github.com/elazarl/go-bindata-assetfs  
> go get github.com/gin-contrib/static

bfs.go
```
import(  
    "net/http"  
)  
  
import (  
    "github.com/elazarl/go-bindata-assetfs"  
)  
  
type BFS struct {  
    FileSystem http.FileSystem  
}  
  
func (bfs *BFS) Open(name string) (http.File, error) {  
    return bfs.FileSystem.Open(name)  
}  
  
func (bfs *BFS) Exists(prefix string, filepath string) bool {  
    var err error  
    var url string  
    url = strings.TrimPrefix(filepath, prefix)  
    if len(url) < len(filepath) {  
        _, err = bfs.FileSystem.Open(url)  
        if err != nil {  
            return false  
        }  
        return true  
    }  
    return false  
}  
  
func GetBFS(root string) *BFS {  
    var fs *assetfs.AssetFS  
    fs = &assetfs.AssetFS{Asset, AssetDir, AssetInfo, root}  
    return &BFS{ fs }  
}
```

server.go

```
import (  
    "crypto/tls"  
    "net/http"  
)  
  
import (  
    "github.com/gin-gonic/gin"  
)  
  
import (  
    **"github.com/gin-contrib/static"**  
)  
  
import (  
    "github.com/facebookgo/grace/gracehttp"  
)  
  
var (  
    SSLCRT string = "/etc/letsencrypt/live/[domain]/fullchain.pem"  
    SSLKEY string = "/etc/letsencrypt/live/[domain]/privkey.pem"  
)  
  
func main() {  
    r := gin.Default()  
    **r.Use(static.Serve("/files", GetBFS("assets/files")))**  
    r.GET("/ping", func(c *gin.Context) {  
        c.JSON(200, gin.H{  
            "message": "pong",  
        })  
    })  
    var x509 tls.Certificate  
    x509, err = tls.LoadX509KeyPair(SSLCRT, SSLKEY)  
    if err != nil {  
        return  
    }  
    var server *http.Server  
    server = &http.Server{  
        Addr: ":8080",  
        Handler: router,  
        TLSConfig: &tls.Config{  
            Certificates: []tls.Certificate{ x509 },  
        },  
    }  
    gracehttp.Serve(server)  
}
```

**Add Multiple Template Renderer**

> go get github.com/gin-contrib/multitemplate

tpl.go

```
import (  
    "fmt"  
    "html/template"  
)  
  
func LoadTemplates(paths ...string) *template.Template {  
    var err error  
    var tpl *template.Template  
    var path string  
    var data []byte  
    for _, path = range paths {  
        data, err = Asset("assets/pages/" + path)  
        if err != nil {  
            fmt.Println(err)  
        }  
        var tmp *template.Template  
        if tpl == nil {  
            tpl = template.New(path)  
        }  
        if path == tpl.Name() {  
            tmp = tpl  
        } else {  
            tmp = tpl.New(path)  
        }  
        _, err = tmp.Parse(string(data))  
        if err != nil {  
            fmt.Println(err)  
        }  
    }  
    return tpl  
}
```

server.go

```
import (  
    "crypto/tls"  
    "net/http"  
)  
  
import (  
    "github.com/gin-gonic/gin"  
)  
  
import (  
    "github.com/gin-contrib/static"  
)  
  
import (  
    **"github.com/gin-contrib/multitemplate"**  
)  
  
import (  
    "github.com/facebookgo/grace/gracehttp"  
)  
  
var (  
    SSLCRT string = "/etc/letsencrypt/live/[domain]/fullchain.pem"  
    SSLKEY string = "/etc/letsencrypt/live/[domain]/privkey.pem"  
)  
  
func main() {  
    **var render multitemplate.Render  
    render = multitemplate.New()  
    render.Add("index", LoadTemplates("base.tpl", "index.tpl"))  
    render.Add("login", LoadTemplates("base.tpl", "login.tpl"))**  
    r := gin.Default()  
    **r.HTMLRender = render**  
    r.Use(static.Serve("/files", GetBFS("assets/files")))  
    r.GET("/", func(c *gin.Context) {  
        c.HTML(200, **"index"**, gin.H{  
            "Title": "Go-Server",  
        })  
    })  
    r.GET("/login", func(c *gin.Context) {  
        c.HTML(200, **"login"**, gin.H{  
            "Title": "Go-Server",  
        })  
    })  
    var x509 tls.Certificate  
    x509, err = tls.LoadX509KeyPair(SSLCRT, SSLKEY)  
    if err != nil {  
        return  
    }  
    var server *http.Server  
    server = &http.Server{  
        Addr: ":8080",  
        Handler: router,  
        TLSConfig: &tls.Config{  
            Certificates: []tls.Certificate{ x509 },  
        },  
    }  
    gracehttp.Serve(server)  
}

```
