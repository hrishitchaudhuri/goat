# goat

goat presently offers five major methods, to be used in conjunction with the project over at [mmaps](https://github.com/hrishitchaudhuri/mmaps). 
<br/>
<br/>
#### obtain
```
$ goat --obtain="Monday"
```
Obtain lists all tasks that are grouped by a common title. It takes a searchable title as an argument. 
<br/>
<br/>
#### recite
```
$ goat --recite
```
Recite lists out all tasks presently stored in the database.
<br/>
<br/>
#### forge 
```
$ goat --forge -t "Thursday" -m "Debate Club"
```
Forge takes a title and a task as arguments and creates a new note in the database. 
<br/>
<br/>
#### affix
```
$ goat --affix=3 -m "Programming with C++"
```
Affix takes a task and a note ID as arguments, and adds the task to the given note. 
<br/>
<br/>
#### obliterate
```
$ goat --oblit=3
```
Obliterate uses the given note ID to delete all data contained within that specific note. 
