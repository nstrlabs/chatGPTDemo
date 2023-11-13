# PCL Documentation

PCL is a language designed to allow users to extract data from a line of text
by describing its structure.

## Syntax basics

At the moment, a valid PCL expression must be composed of one or more fields
such that there are separators between them. That is, it must follow this rule:
```
separator? fixedLength* field (separator fixedLength* field)* separator?
```

> Note: At the moment, the only possible fixed-length field is
  the [String](#field-string).

Valid example:
```
{myFieldOne:string} {myFieldTwo:int}< +>{myCsv:csv(fields=[0,2],separator=",")}
```

Invalid example (due to there is no separator):
```
{myFieldOne:string}{myFieldTwo:int}
```

### Syntax basics: field names

The grammar supports any kind of name that is written with the set of
characters `A-Z`, `a-z`, `0-9` and `_`.

## Syntax fields

In a PCL, we can write any sequence of fields. The type of the fields can be:
- [CSV](#field-csv).
- [Float](#field-float).
- [Group](#field-group).
- [Integer](#field-integer).
- [JSON](#field-json).
- [Key-value list](#field-key-value-list).
- [String](#field-string).

Also, we have a special type of element: [Separator](#field-separator).

### Field: CSV

CSV is a configurable field. The available options are:
- [indices](#option-indices) (optional) to select which columns we want to
  extract from the CSV.
- [separator](#option-separator) (optional) to define the separator of
  the columns.
- [totalColumns](#option-totalColumns) (optional) is useful only in the use cases where
  the csv delimiter and the separator are equal. In this case, it is necessary
  to define the number of columns related to the csv through the 'totalColumns' option.
  

Example:
```
{myFieldName:csv(indices=[0,1,3],totalColumns=4,separator=",")}
```

### Field: Float

Float is a configurable field. The available options are:
- `decimalSeparator` (optional) that defines the separator of decimal.
- `thousandSeparator` (optional) that defines the separator of thousands.

The options `decimalSeparator` and `thousandSeparator` cannot contain the same
value.

Example:
```
{myField:float(decimalSeparator=".")}
```

### Field: Group

Groups are a special type that might contain two ore more simple types. Those
simple types are:
- [Float](#field-float).
- [Integer](#field-integer).
- [Separator](#field-separator).
- [String](#field-string).

Example:
```
{myGroupName:{{myFieldOne:string} {myFieldTwo:int}< +>{myFieldThree:int}}}
```

### Field: Integer

Integer is a configurable field. The available options are:
- `thousandSeparator` (optional) that defines the separator of thousands.

Example:
```
{myFieldName:int(thousandSeparator=",")}
```

### Field: JSON

JSON is a configurable field. The available options are:
- [fields](#option-fields) (optional) to select which items we want to extract
  from the JSON.

Example:
```
{myFieldName:json(fields=["itemOne","itemTwo"])}
```

### Field: Key-value list

Key-value list is a configurable field. The available options are:
- [kvSeparator](#option-kvseparator) (optional) that defines the separator
  between keys and values.
- [listSeparator](#option-listseparator) (optional) that defines the separator
  between each key-value item.
- [indices](#option-indices) (optional) to select which items we want to
  extract from the list by their position in the list.
- [fields](#option-fields) (optional) to select which items we want to extract
  from the list by their key names.

Although this field allows the options `indices` and `fields`, they cannot be
used simultaneously.

Example:
```
{myFieldName:keyValueList(kvSeparator=":",listSeparator=",")}
```

### Field: Separator

Separator is a special type of element and there are two types of them:
- One the one hand, there are static separators. This is a constant **string**
  that must exists between two fields. Unlike other fields, the static
  separators are just a string (it may contain one or more characters
  except `<`, `>`, `{` or `}`, unless they are escaped with `\`) in the PCL
  expression.
- On the other hand, dynamic separators are composed of a **single character**
  and its cardinality (how many times is repeated) surrounded by `<` and `>`.

In order to specify the cardinality, we have several posibilities:
- `+` indicates that there is one or more repetitions.
- `(n)`, where `n` is a strictly positive integer, indicates that there are
  exactly `n` repetitions of the character.
- `(m,n)`, where `m < n` and they are strictly positive integers, indicates
  that there are between `m` and `n` (included) repetitions of the character.

Example of static separator (whitespace ` `):
```
{myFieldOne:string} {myFieldTwo:string}
```

Example of dynamic (undefined) separator:
```
{myFieldOne:string}< +>{myFieldTwo:string}
```

Example of dynamic (range) separator:
```
{myFieldOne:string}< (2,4)>{myFieldTwo:string}
```

It is important to remark to escape the mentioned characters. Example:
```
\<{myNumber:int}\> \{{anotherField:string}\}
```

### Field: String

Strings is a configurable field. The available options are:
- `length` (optional) that defines how long is the string.

Example:
```
{myField:string(length=2)}
```

#### Special case: fixed-length strings

There is a special case with String fields: if the field is using the option
`length`, we may add another field very next to it without any separator.

Example:
```
{oneField:string(length=2)}{anotherField:string(length=3)}{lastField:string}
```

## Syntax configuration options

### Option: fields

The value must be a list of strings. Note that the list **cannot** contain
other kind of values (e.g. numbers).

These are valid examples:
- `fields=["oneField","anotherField.with.subField"]`
- `fields=[]`

These are invalid examples:
- `fields=[oneField,anotherField]`
- `fields=["oneField,anotherField"]`
- `fields=[0,1]`

Additionally, we may specify the type of each field by writting a colon (`:`)
followed by the type: `bool`, `float`, `int` or `string`. For example:
`fields=["oneField":bool, "middleField", "anotherField":int]`.

### Option: indices

The value must be a list with numbers. Note that the list **cannot** contain
other values apart from positive integers (including zero).

These are valid examples:
- `indices=[0,1,3]`
- `indices=[]`

These are invalid examples:
- `indices=["0","1"]`
- `indices=[-3,1]`

Additionally, we may specify the type of each index by writting a colon (`:`)
followed by the type: `bool`, `float`, `int` or `string`. For example:
`indices=[0:bool, 1, 3:int]`.

### Option: kvSeparator

The value must be a character from the set: `:`, `=`.

These are valid examples:
- `kvSeparator=":"`
- `kvSeparator="="`

These are invalid examples:
- `kvSeparator=";"`
- `kvSeparator=:`

### Option: length

The value must be a strictly positive integer.

These are valid examples:
- `length=1`
- `length=25`

These are invalid examples:
- `length="1"`
- `length=0`
- `length=-3`

### Option: listSeparator

The value must be a character from the set: `|`, `;`, `,`, `\t`, ` `.

These are valid examples:
- `listSeparator=";"`
- `listSeparator="|"`

These are invalid examples:
- `listSeparator="-"`
- `listSeparator=;`

### Option: separator

The value must be a character from the set: `|`, `;`, `,`, `\t`.

These are valid examples:
- `separator=";"`
- `separator="|"`

These are invalid examples:
- `separator="-"`
- `separator=;`

### Option: totalColumns

The value must be a strictly positive integer.
The parser going to take under consideration the value of this option
only in the especific case where the csv delimeter and the follow
separator are equals.

These are valid examples:
- `totalColumns=1`
- `totalColumns=5`

NOTE: A valid value for this option must be **equal** to the number of columns in the csv.

These are invalid examples:
- `totalColumns="1"`
- `totalColumns=0`
- `totalColumns=-3`

### Default values

Each option has a different default value:
- `decimalSeparator`: `.`
- `fields`: `[]`.
- `indices`: `[]`.
- `kvSeparator`: `=`.
- `length`: `-1` (i.e. no length specified).
- `listSeparator`: `,`.
- `separator`: `,`.
- `thousandSeparator`: (empty string).

For example, `csv()` might include the option `separator`, but it was not
explicitly specified. In such case, it is the same like `csv(separator=",")`.

#### Default values in "fields" and "indices"

The options `fields` and `indices` are a special case since they contain a list
of items we want to extract from a text. Although `fields` is an array of
strings and `indices` is an array of integers, we may specify the subtype
following the PCL Grammar. However, if the subtype is omitted, it assumes that
each index/field will be an string.

For example, if `indices = [0, 1:int, 3:bool]`, it assumes that the index `0`
will be an string since the subtype is not specified.

## Example

A valid PCL expression could be:
```
{lastName:string}, {firstName:string}< +>{age:int}: {info:json(fields=["country","occupation"])}
```

Here there's 4 fields (`lastName`, `firstName`, `age` and `info`) and 3
separators (`, `, `< +>` and `: `).

This PCL expression can be used to extract fields from different lines of text
that have the same structure. For example, given the text
`Doe, John 37: {"country": "UK", "occupation": "father"}`, the PCL expression
can be used to extract the following fields:
- `lastName` as `Doe`.
- `firstName` as `John`.
- `age` as `37`.
- `info` as `{"country": "UK", "occupation": "father"}`.
- `info.country` as `UK`.
- `info.occupation` as `father`.

## Example

Use case with a single log:
```
<5>1 2022-04-28T16:30:29Z S12XYZSERV1 LEEF:1.0|Tech-Secure|Vault|11.5.0003|295|sev=6 Action=Retrieve password EventMessage=Retrieve password OSUser= usrName=SysAdmin src=10.12.34.56 SourceUser= TargetUser= File=Root\Operating System-XYZBANK_ADPlatform_RandomCode_Pol8Symbol_30days-group.xyz.com-SV123456 Safe=PC-AD-SECURE Location= Category= RequestId= Reason=CPM ExtraDetails= GatewayStation= CAPolicy=
```

A valid expresion to parse the message is:
```
\<{priority:string}\>{messageCode:string} {datetime:string} {hostCode:string} {parameters:keyValueList(kvSeparator="=",listSeparator=" ",fields=["2022-04-28T16:30:29Z S12XYZSERV1 LEEF:1.0|Tech-Secure|Vault|11.5.0003|295|sev","Action","password EventMessage","password OSUser","usrName","src","SourceUser","TargetUser","File","System-XYZBANK_ADPlatform_RandomCode_Pol8Symbol_30days-group.xyz.com-SV123456 Safe","Location","Category","RequestId","Reason","ExtraDetails","GatewayStation","CAPolicy"])}
```

## Example

Use case with a few logs:
```
81.90.144.56 - - [26/Jan/2019:20:17:17 +0330] "GET /static/images/zanbil-kharid.png HTTP/1.1" 200 358 "https://znbl.ir/static/bundle-bundle_site_head.css" "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:61.0) Gecko/20100101 Firefox/61.0" "-"
81.90.144.56 - - [26/Jan/2019:20:17:17 +0330] "GET /static/images/tracking-bg.png HTTP/1.1" 200 16988 "https://www.zanbil.ir/?utm_source=2&utm_medium=26&utm_campaign=Z&utm_term=205" "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:61.0) Gecko/20100101 Firefox/61.0" "-"
151.238.65.150 - - [26/Jan/2019:20:17:17 +0330] "GET /favicon.ico HTTP/1.1" 200 0 "https://www.zanbil.ir/m/filter/b878%2Cp10" "Mozilla/5.0 (Linux; U; Android 4.1.2; en-US; GT-S5282 Build/JZO54K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 UCBrowser/10.10.0.796 U3/0.8.0 Mobile Safari/534.30" "-"
```

A valid expresion to parse the message is:
```
{ipAddress:string} - - [{timestamp:string}] "{requestMethod:string} {requestPath:string} HTTP/1.1" {httpStatus:int} {responseSize:int} "{referrer:string}" "{userAgent:string}" "{additionalInfo:string}"
```

## Example

Use case with a few logs:
```
<14> Hello world {"hello":"world"}
<16> Goodbye moon {"goodbye":"moon"}
```

A valid expresion to parse the message is:
```
\<{fieldName1:int}\> {fieldName2:string} {fieldName3:string} {{fieldName4:json(fields=["hello","goodbye"])}}
```