::: v-pre
https://universalglue.dev/posts/gin-post-form-data/

> This is the fourth in a [series of articles](https://universalglue.dev/series/how-to-build-a-web-app-with-gin/) about writing a small reading list app in Go for personal use.

> (Don’t be scared off by the length – there’s a lot of test code that’s shown multiple times due to enhancements.)

This article builds the C of our CRUD app:

-   add a template with a form to enter books
-   add routes to GET and POST that template

By the end of this article you’ll have:

-   a page with a form that you can use to add books to the database
-   tests around form handling
-   a quick workflow hack to speed up testing when writing a test

![This is for posting a completely different kind of form. (Photo by RuthAS, CC-BY.)](https://universalglue.dev/posts/gin-post-form-data/postbox.jpg)

_This is for posting a completely different kind of form. (Photo by [RuthAS](https://commons.wikimedia.org/wiki/User:RuthAS), [CC-BY](https://creativecommons.org/licenses/by/4.0/deed.en).)_

## Creating the Form

### Add a Test for the New Page

Let’s start with a test. Our initial goal is for the server to give us a page with a form that we can fill in with a book’s title and author. Add this to `main_test.go`:

```go
func TestBookNewGet(t *testing.T) {
	t.Parallel()
	tcs := []struct {
		name string
	}{
		{"basic"},
	}

	for i := range tcs {
		tc := &tcs[i]
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			db := freshDb(t)
			w := getHasStatus(t, db, "/books/new", http.StatusOK)
			body := w.Body.String()
			fragments := []string{
				"<h2>Add a Book</h2>",
				`<form action="/books/new" method="POST">`,
				`<input type="text" name="title" id="title"`,
				`<input type="text" name="author" id="author"`,
				`<button type="submit"`,
			}
			bodyHasFragments(t, body, fragments)
		})
	}
}
```

This test uses the structure [from last week](https://universalglue.dev/posts/testing-gin-web-handlers/#table-driven-test-case), just changing the details to get a new route and expect a different set of fragments.

This test compiles fine, but it fails – as expected, because we need to add the page to the app.

### Workflow Speedup Bonus

There’s a little workflow tweak we can make here. On my machine the whole test suite runs in 0.016 seconds, so we don’t really need it yet. I use this when I’m working on a project with a test suite that has run times that take more than just a few seconds.

The [Makefile we wrote](https://universalglue.dev/posts/integrating-gorm-gin/#free-bonus-makefile) uses a `TESTFLAGS` variable that we can set on the command line. So if we run `make check TESTFLAGS="-run TestBookNewGet"` it will _only_ run the new test. And if you’re using the [git alias I wrote about](https://universalglue.dev/posts/tighten-feedback-loop/) last week, you can use `git wm 'check TESTFLAGS="-run TestBookNewGet"'` to rerun the test any time the code changes. (Be mindful of the quoting!)

### Add a New Template Containing the Form

Now that we’ve got our test, we can add the new template. Nothing special here, just another template with a basic HTML form. Add this to a new file `templates/books/new.html`:

```go
{{ define "books/new.html" }}
{{ template "base/header.html" . }}

<h2>Add a Book</h2>

<form action="/books/new" method="POST">
  <div>
    <label for="title">Title</label>
    <input type="text" name="title" id="title">
  </div>
  <div>
    <label for="author">Author</label>
    <input type="text" name="author" id="author">
  </div>
  <button type="submit" class="btn btn-primary">Save</button>
</form>

{{ template "base/footer.html" . }}
{{ end }}
```

### Add a Route

Modify `setupRouter` in `main.go` so that it looks like this (two new lines):

```go
func setupRouter(r *gin.Engine, db *gorm.DB) {
	r.LoadHTMLGlob("templates/**/*.html")
	r.Use(connectDatabase(db))
	r.GET("/books/", bookIndexHandler)
	r.GET("/books/new", bookNewGetHandler)
	r.POST("/books/new", bookNewPostHandler)
	r.GET("/", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/books/")
	})
}
```

Note that I’ve already added the POST route here since we’ll need that below, but I haven’t defined the handler function yet. For now just comment out that line so that it will compile, we’ll come back to this in a few minutes.

Add the handler function for the GET route somewhere in `main.go`:

```go
func bookNewGetHandler(c *gin.Context) {
	c.HTML(http.StatusOK, "books/new.html", gin.H{})
}
```

After adding the trivial handler for the form, two things happen: (1) the test should start passing, and (2) we can load the form in the browser.

> Note that if you’re using `git wm cover` from above, this will _only_ rebuild and rerun the test – to rebuild and run the server you need to
> 
> 1.  press `q` to quit from `entr`,
> 2.  run `make` to rebuild the server, and
> 3.  run `./aklatan` to actually run the server.

![A screenshot of the test form.](https://universalglue.dev/posts/gin-post-form-data/screenshot-form.png)

_A screenshot of the test form._

This is ugly! But it works. We’ll come back to it in a few weeks when we integrate CSS into the app.

Now that the test is passing, we know our first task is done and we can move on to actually handling the form data.

## POST Handler

### Add a Test for the Form Handler

Here’s a basic test for the happy path of the form handler: we’re passing valid data and we just expect to get back a 302. Note that this test has a “1” suffix – there are other versions below that have more complete tests. I’m keeping them all in my code so I can make sure everything runs, but you really only need the final one.

Add the following three functions to `main_test.go`:

```go
func TestBookNewPost1(t *testing.T) {
	t.Parallel()
	tcs := []struct {
		name   string
		data   gin.H
		status int
	}{
		{
			"nominal",
			gin.H{"title": "my book", "author": "me"},
			http.StatusFound,
		},
	}

	for i := range tcs {
		tc := &tcs[i]
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			db := freshDb(t)
			_ = postHasStatus(t, db, "/books/new", &tc.data,
				tc.status)
		})
	}
}
```

This uses a new function `postHasStatus`, which is similar in form to the `getHasStatus` function we wrote previously:

```go
func postHasStatus(t *testing.T, db *gorm.DB, path string,
	h *gin.H, status int) *httptest.ResponseRecorder {

	t.Helper()
	data := url.Values{}
	for k, vi := range *h {
		v := vi.(string)
		data.Set(k, v)
	}

	w := httptest.NewRecorder()
	ctx, router := gin.CreateTestContext(w)
	setupRouter(router, db)

	req, err := http.NewRequestWithContext(ctx, "POST", path,
		strings.NewReader(data.Encode()))
	if err != nil {
		t.Errorf("got error: %s", err)
	}
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	router.ServeHTTP(w, req)
	responseHasCode(t, w, status)
	return w
}
```

The interesting differences from the GET version are:

-   It ranges over the `gin.H` (which is just a `map`) and sets the key/value pairs into an `url.Values`.
-   That `url.Values` gets encoded into the request.
-   It sets a header: `Content-Type: application/x-www-form-urlencoded`.
-   And we’ve refactored a small function out of those functions to check the response code:

```go
func responseHasCode(t *testing.T, w *httptest.ResponseRecorder,
	expected int) {

	if expected != w.Code {
		t.Errorf("expected response code %d, got %d", expected, w.Code)
	}
}
```

`TestBookNewPost1` fails because we get a 404 status. We need a route for the POST.

### Add the POST Form Handler

Uncomment the POST route in `setupRouter`, and add the handler function in `main.go`:

```go
func bookNewPostHandler(c *gin.Context) {
	book := &Book{}
	if err := c.Bind(book); err != nil {
		// Note: if there's a bind error, Gin will call
		// c.AbortWithError. We just need to return here.
		return
	}
	// FIXME: There's a better way to do this validation!
	if book.Title == "" || book.Author == "" {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}
	db := c.Value("database").(*gorm.DB)
	if err := db.Create(&book).Error; err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	c.Redirect(http.StatusFound, "/books/")
}
```

The handler creates a book using the model we defined, and then it uses `c.Bind` to use [Gin’s model binding support](https://gin-gonic.com/docs/examples/binding-and-validation/) to load the values from the request into the model.

Then, we want to make sure that nobody enters an empty title or author, we have some manual validation. If this fails, we call `c.AbortWithStatus` to respond with a 400 error, and then we just return from the function. It’s important to remember to `return` after calling `c.AbortWithStatus` – this is easy to forget, and if you do it will confuse Gin and result in a logged warning like `[GIN-debug] [WARNING] Headers were already written. Wanted to override status code 400 with 302`.

Finally, it gets the db handle from the context and calls `db.Create` to add a row to the database. If the insertion fails it aborts with a 500 error. Otherwise it responds with a 302 redirect to the index page.

Now the test should pass! Hrm. We’re passing in valid data, but the handler is replying with 400. What’s up?

### Binding Form Data

When Gin binds the form data to the model, the field names have to match exactly. Since our form is using `name="title"` and `name="author"`, and the struct is using `Title` and `Author` (capitalized because they’re exported fields), Gin can’t match the inputs to the destinations.

There are two ways to fix this:

1.  Change the form to use capitalized names for those inputs.
2.  Add decorations to the struct fields to specify the names to map.

We’ll use the latter, so go ahead and update the struct in `models.go`:

```go
package main

type Book struct {
	ID     uint   // FIXME: make Gin skip mapping this field!
	Title  string `form:"title"`
	Author string `form:"author"`
}
```

There are some extra decorations we can provide to perform validation, but we’re skipping those for now and will come back to revisit that topic in a couple of weeks.

Note the “FIXME” comment – I’ll talk about that more below.

Now that we’ve got the names mapped right, our test passes.

### Error Handling Strategy

Our error handling “strategy” at this point (if you can call it a strategy) is for the handler to simply abort with an HTTP error status code.

This provides a _bad_ user experience! But there’s not enough room in this week’s post to fully explore Gin’s validation machinery and get better error messages set up.

We’ll look at this more in two weeks.

## Testing the Handler

We’ve got a passing test and we know the handler “works”, but we don’t really have good coverage of the test, and the checks in our test are somewhat lacking.

The handler to GET the form doesn’t need anything else tested – there’s nothing active happening in that handler, it’s just retrieiving the template and we’re verifying enough in the current test.

The test for the POST handler, however, is lacking any error cases, and it’s completely missing any verification that the book has been added to the database.

### Error Cases

The error cases we should test are:

1.  Gin data binding errors
2.  missing data errors
3.  db errors

Here’s the modified version of `TestBookNewPost1`. You should edit the existing function in `main_test.go` to look like this – I’m keeping both around just so that I can extract code into this post.

```go
func TestBookNewPost2(t *testing.T) {
	t.Parallel()

	dropTable := func(t *testing.T, db *gorm.DB) {
		err := db.Migrator().DropTable("books")
		if err != nil {
			t.Fatalf("error dropping table 'books': %s", err)
		}
	}

	tcs := []struct {
		name   string
		data   gin.H
		setup  func(*testing.T, *gorm.DB)
		status int
	}{
		{
			name:   "nominal",
			data:   gin.H{"title": "my book", "author": "me"},
			status: http.StatusFound,
		},
		{
			// This causes Bind() to fail, because ID is an integer
			// field and the parsing will fail when it tries to map
			// the ID.
			name:   "bind_error",
			data:   gin.H{"ID": "xxx", "title": "mytitle", "author": "me"},
			status: http.StatusBadRequest,
		},
		{
			// This makes the manual field validation fail because the
			// author is empty.
			name:   "empty_author",
			data:   gin.H{"title": "1"},
			status: http.StatusBadRequest,
		},
		{
			// This makes the manual field validation fail because the
			// title is empty.
			name:   "empty_title",
			data:   gin.H{"author": "9"},
			status: http.StatusBadRequest,
		},
		{
			// This makes the manual field validation fail because both
			// title and author are empty.
			name:   "empty",
			data:   gin.H{},
			status: http.StatusBadRequest,
		},
		{
			name:   "db_error",
			data:   gin.H{"title": "a", "author": "b"},
			setup:  dropTable,
			status: http.StatusInternalServerError,
		},
	}

	for i := range tcs {
		tc := &tcs[i]
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			db := freshDb(t)
			if tc.setup != nil {
				tc.setup(t, db)
			}
			_ = postHasStatus(t, db, "/books/new", &tc.data,
				tc.status)
		})
	}
}
```

The `bind_error` test case triggers an error in `c.Bind` when it tries to parse `"xxx"` into an integer for the ID field. Note that we _should_ have Gin skip mapping the ID field – this is the “FIXME” comment in models.go shown above. We don’t want to allow users to set the ID to an arbitrary value. Fixing this is done by setting `form:"-"` as the decorator on the ID field.

I’m leaving this in its current form for now in order to demonstrate how to cover this error condition with a test case. I’ll revisit this function and the test cases in an upcoming post on Gin validators.

There are three new test cases for the missing data error case: `empty_author`, `empty_title`, and `empty`. These cover the conditions in the manual validation check.

Finally, the `db_error` test case adds a new twist. The easiest way to trigger a database error is to simply drop the table. So the test case struct has a new field: `setup` is an optional function that will be called after the database has been initialized, but before the POST is sent. Note that there’s a check in the subtest function so that it only calls this function if it is non-nil.

`db_error` is currently the only test case that sets this function. I’ve added field labels to all of the initializers so that we can skip explicitly setting `setup` to nil in the other test cases.

### Valid Data

The two extra checks we want to perform in the case where the POST was successful are:

1.  fetching from db to verify the record
2.  checking the redirect Location

Here’s a third version of the function. This has added code for these two checks. (See `// NEW CHECKS HERE`.)

```go
func TestBookNewPost3(t *testing.T) {
	t.Parallel()

	dropTable := func(t *testing.T, db *gorm.DB) {
		err := db.Migrator().DropTable("books")
		if err != nil {
			t.Fatalf("error dropping table 'books': %s", err)
		}
	}

	tcs := []struct {
		name   string
		data   gin.H
		setup  func(*testing.T, *gorm.DB)
		status int
	}{
		{
			name:   "nominal",
			data:   gin.H{"title": "my book", "author": "me"},
			status: http.StatusFound,
		},
		{
			// This causes Bind() to fail, because ID is an integer
			// field and the parsing will fail when it tries to map
			// the ID.
			name:   "bind_error",
			data:   gin.H{"ID": "xxx", "title": "mytitle", "author": "me"},
			status: http.StatusBadRequest,
		},
		{
			// This makes the manual field validation fail because the
			// author is empty.
			name:   "empty_author",
			data:   gin.H{"title": "1"},
			status: http.StatusBadRequest,
		},
		{
			// This makes the manual field validation fail because the
			// title is empty.
			name:   "empty_title",
			data:   gin.H{"author": "9"},
			status: http.StatusBadRequest,
		},
		{
			// This makes the manual field validation fail because both
			// title and author are empty.
			name:   "empty",
			data:   gin.H{},
			status: http.StatusBadRequest,
		},
		{
			name:   "db_error",
			data:   gin.H{"title": "a", "author": "b"},
			setup:  dropTable,
			status: http.StatusInternalServerError,
		},
	}

	for i := range tcs {
		tc := &tcs[i]
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			db := freshDb(t)
			if tc.setup != nil {
				tc.setup(t, db)
			}
			w := postHasStatus(t, db, "/books/new", &tc.data,
				tc.status)

			// NEW CHECKS HERE
			if tc.status == http.StatusFound {
				// Make sure the record is in the db.
				books := []Book{}
				result := db.Find(&books)
				if result.Error != nil {
					t.Fatalf("error fetching books: %s", result.Error)
				}
				if result.RowsAffected != 1 {
					t.Fatalf("expected 1 row affected, got %d",
						result.RowsAffected)
				}
				if tc.data["title"] != books[0].Title {
					t.Fatalf("expected title '%s', got '%s",
						tc.data["title"], books[0].Title)
				}
				if tc.data["author"] != books[0].Author {
					t.Fatalf("expected author '%s', got '%s",
						tc.data["author"], books[0].Author)
				}

				// Check the redirect location.
				url, err := w.Result().Location()
				if err != nil {
					t.Fatalf("location check error: %s", err)
				}

				if "/books/" != url.String() {
					t.Errorf("expected location '/books/', got '%s'",
						url.String())
				}
			}
		})
	}
}
```

We only perform the extra checks if the test case’s status code is StatusFound. An alternative approach that I use sometimes is to set an optional `verify` function in the test case.

There are two opportunities for refactoring that I’m not showing here:

1.  The verification of the books can be extracted into a separate function. This could be in the form of a function like `tableHasRows(t, db, "books", count)` that just verifies the given table has the correct number of rows. This is a little bit weaker verification than what’s in the function above, but it may suffice for some projects. A more thorough function like `dbHasBooks(t, db, []Book{"my book", "me"})` might also be worth creating.
2.  The location checking could be extracted into `responseHasLocation(t, w, "/books/").`

I usually wait until I can see that these refactorings are really necessary instead of setting up the extra functions up-front. You might decide to be proactive and split up the verification early. Either approach is valid, but I’ve found that by waiting I can see which pieces of data are going to vary and can make sure I set up the helper according to the needs instead of having to warp my test cases to suit the helpers I already have written.

One final note: in at least one previous project I took the location from the response, ran a GET request on it, and checked for fragments in that response. This is wandering a little further out of “unit test” territory into the land of “integration test”. It’s not necessary here because we already have a unit test that verifies the book index page when there are books in the database. But it can be a handy check when the POST has side effects that don’t just show up in the database – for example, if it sets a flash message on the session, we can verify that flash message shows up on the index page.

You can see the [merge request](https://gitlab.com/bstpierre/aklatan/-/merge_requests/4) for this change on Gitlab.

## Looking Ahead

[Tuesday’s article](https://universalglue.dev/posts/semgrep-rules-for-go-web-projects/) will feature a set of semgrep rules to help catch some common mistakes, for example:

-   the handler naming scheme is already becoming a bit haphazard; a rule can enforce that naming scheme
-   forgetting to `return` after calling `c.AbortWithStatus`
-   also enforcing naming schemes on templates and test functions
-   enforcing some conventions on test functions and helpers
-   catching some “oops” mistakes in templates
:::
