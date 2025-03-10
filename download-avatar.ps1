$url = "https://avatars.githubusercontent.com/u/54739445"
$output = "public/images/profile-avatar.png"
Invoke-WebRequest -Uri $url -OutFile $output
Write-Host "Downloaded the GitHub avatar to $output" 