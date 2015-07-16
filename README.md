PHP Multipart Encoder
=====================

This library will build a Multipart-encoded string suitable for use in HTTP requests.

## Usage

Requiring from `composer.json`:

```
  "p3k/multipart": "*"
```

```php
// Using composer...
require('vendor/autoload.php');

// ...or requiring directly
require('src/p3k/Multipart.php');

// Create a new Multipart object
$multipart = new p3k\Multipart();

// Example POST data
$params = [
  'category' => [
    'one',
    'two'
  ],
  'name' => 'test',
  'nested' => [
    'foo' => [
      'bar1',
      'bar2'
    ],
    'bar' => 'foo'
  ]
];

// Add the params to the request
$multipart->addArray($params);

// You can add files too!
$multipart->addFile('photo', '/tmp/example.jpg', 'image/jpeg');

// Set up curl
$ch = curl_init('http://localhost:8000/server.php');
curl_setopt($ch, CURLOPT_POST, true);

// Set the POSTFIELDS to the result of this object
curl_setopt($ch, CURLOPT_POSTFIELDS, $multipart->data());

// You'll also need to set the Content-Type header
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
  'Content-type: ' . $multipart->contentType()
));

curl_exec($ch);
```

## Background 

The built-in cURL library does not properly encode values that are arrays when it builds
a multipart request. For example, this request results in a "Notice: Array to string conversion"
and the value of the parameter is "Array":

```php
$params = array(
  'category' => [
    'one',
    'two'
  ]
);

$ch = curl_init('http://localhost:8000/server.php');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
curl_exec($ch);
```

See PHP Bugs:

* https://bugs.php.net/bug.php?id=51634
* https://bugs.php.net/bug.php?id=66436

This library can be used in place of cURL's built-in encoding.


## Testing

You can test receiving this payload with the PHP and Ruby servers provided in this project.

To run the PHP server:

```
cd servers
php -S localhost:8000
```

This will run the built-in PHP web server listening on port 8000. Run the example code above 
and you will see the $_POST variable populated with the request.

To run the Ruby server, make sure you `bundle install sinatra`, then:

```
cd servers
ruby server.rb
```

Then you can post to `http://localhost:4567/upload` and you will see the JSON representation
of the object that is posted.

