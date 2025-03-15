<!DOCTYPE html>
<html>
<head>
    <title>From Emils.Graphics Contact Form</title>
</head>
<body>
    <h2>From Emils.Graphics Contact Form</h2>
    <p><strong>Name:</strong> {{ $data['name'] }}</p>
    <p><strong>Email:</strong> {{ $data['email'] }}</p>
    <p><strong>Message:</strong></p>
    <p>{{ $data['message'] }}</p>
</body>
</html>