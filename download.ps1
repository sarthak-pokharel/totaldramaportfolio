$url = "https://raw.githubusercontent.com/pmndrs/drei-assets/master/hdri/dikhololo_night_1k.hdr"
$output = "public/hdri/dikhololo_night_1k.hdr"
Invoke-WebRequest -Uri $url -OutFile $output
Write-Host "Downloaded the HDR file to $output" 