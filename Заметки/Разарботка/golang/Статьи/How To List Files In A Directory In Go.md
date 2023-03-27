https://golang.cafe/blog/how-to-list-files-in-a-directory-in-go.html

In Go (Golang) you often have many options to achieve the same result when it comes to use the standard library. In this article we are going to breakdown a list of possible options that you can use to list files in a directory using Go. We are going to see also how to list files recursively when having a nested directory structure just by using the Go standard library. By the end of this article you will be able to use all of the following options to list files in a directory

-   ioutil.ReadDir
-   filepath.Walk
-   os.File.Readdir

## Option 1: ioutil.ReadDir

ioutil.ReadDir comes from the [ioutil package](https://golang.org/pkg/io/ioutil/) in the Go standard library, you can check the documentation from the official [Go Doc website](https://golang.org/pkg/io/ioutil/#ReadDir)

```go
func ReadDir(dirname string) ([]os.FileInfo, error)
```

> ReadDir reads the directory named by dirname and returns a list of directory entries sorted by filename.

Let’s see how we can practically use ioutil.ReadDir in this example

```go
package main

import (
    "fmt"
    "io/ioutil"
    "log"
)

func main() {
    files, err := ioutil.ReadDir("/tmp/")
    if err != nil {
        log.Fatal(err)
    }

    for _, file := range files {
        fmt.Println(file.Name(), file.IsDir())
    }
}
```

And that’s my output

```go
com.apple.launchd.Uzc3xBHlg5 true
fseventsd-uuid false
powerlog true
tmux-501 true
```

If you want to learn more on how to use the output from this function you can check out the structure of [os.FileInfo](https://golang.org/pkg/os/#FileInfo) which allows you to see properties of the file or directory returned.

## Option 2: filepath.Walk

[filepath.Walk](https://golang.org/pkg/path/filepath/#Walk) is another option you can use to list files in a directory structure, from the [filepath Go package](https://golang.org/pkg/path/filepath/), it also allows us to recursively discover directories and files. The official documentation reads as follows

```go
func Walk(root string, walkFn WalkFunc) error
```

> Walk walks the file tree rooted at root, calling walkFn for each file or directory in the tree, including root. All errors that arise visiting files and directories are filtered by walkFn. The files are walked in lexical order, which makes the output deterministic but means that for very large directories Walk can be inefficient. Walk does not follow symbolic links.

WalkFunc is the type of the function called for each file or directory visited by Walk. Here’s the function signature

```go
type WalkFunc func(path string, info os.FileInfo, err error) error
```

Here’s an example on how to use filepath.Walk to discover files and directories

```go
package main

import (
    "fmt"
    "os"
    "path/filepath"
)

func main() {
    err := filepath.Walk("/tmp/", func(path string, info os.FileInfo, err error) error {
        if err != nil {
            fmt.Println(err)
            return err
        }
        fmt.Printf("dir: %v: name: %s\n", info.IsDir(), path)
        return nil
    })
    if err != nil {
        fmt.Println(err)
    }
}
```

That’s the expected output from the code snippet above

```go
dir: true: name: /tmp/
dir: false: name: /tmp/00000000002b8a24
dir: false: name: /tmp/00000000002c3e48
dir: false: name: /tmp/00000000002d25ea
dir: true: name: /tmp/com.apple.launchd.Uzc3xBHlg5
dir: false: name: /tmp/com.apple.launchd.Uzc3xBHlg5/Listeners
dir: false: name: /tmp/fseventsd-uuid
dir: true: name: /tmp/powerlog
dir: true: name: /tmp/tmux-501
dir: false: name: /tmp/tmux-501/default
```

## Option 3: os.File.Readdir

The last option is using just the file pointer coming from the [os.File](https://golang.org/pkg/os/#File) when reading a file from the file system. The package is the [os package](https://golang.org/pkg/os/) in the Go standard library.

```go
func (f *File) Readdir(n int) ([]FileInfo, error)
```

> Readdir reads the contents of the directory associated with file and returns a slice of up to n FileInfo values, as would be returned by Lstat, in directory order. Subsequent calls on the same file will yield further FileInfos.  
> If n > 0, Readdir returns at most n FileInfo structures. In this case, if Readdir returns an empty slice, it will return a non-nil error explaining why. At the end of a directory, the error is io.EOF.  
> If n <= 0, Readdir returns all the FileInfo from the directory in a single slice

This below is an example on how to use os.File.Readdir to list files from a given directory

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    f, err := os.Open("/tmp")
    if err != nil {
        fmt.Println(err)
        return
    }
    files, err := f.Readdir(0)
    if err != nil {
        fmt.Println(err)
        return
    }

    for _, v := range files {
        fmt.Println(v.Name(), v.IsDir())
    }
}
```

Here’s the expected output from the above code snippet

```go
00000000002b8a24 false
fseventsd-uuid false
powerlog true
com.apple.launchd.Uzc3xBHlg5 true
00000000002c3e48 false
00000000002d25ea false
tmux-501 true
```