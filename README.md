# simee

Ultra simple symlinking of local npm packages.

```
npm install simee -g
```

Create a `.simeerc` file at your projects root:

```
{
	"name-of-local-package": "../path/to/local/package",
	"name-of-other-local-package": "../path/to/other/local/package",
}
```

Then run simee.

```
simee
```

It will symlink the target package as well as any binaries.

I use this for some quick local test/development.  Probably needs lots more work to be useable to others.  For example I haven't even considered the dependencies of the packages being linked.
