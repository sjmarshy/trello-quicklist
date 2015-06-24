# Trello Quicklist

* sometimes I get lists of things I need to do in email
* I had to move them across to Trello a couple of times
* I'd heard that Trello had a pretty great API
* I thought it'd be easier to write a tool to convert simple text lists into
  trello tasks


The client will be a simple `cli` that should work a little like this:

```bash

cat listfile.txt | quicklist <boardname> <listname>

# or

quicklist <boardname> <listname> --input listfile.txt

```

if the boardname or listname you specify do not exist, they will be created.
