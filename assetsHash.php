<?php
$globs = [
    'public/index.css',
    'public/src/*',
    'public/src/**/*',
];
$hashes = [];
foreach ($globs as $glob) {
    $files = glob($glob);
    foreach ($files as $file) {
        if(!is_file($file))
            continue;
        $hashes[$file] = hash_file('crc32', $file);
    }
}
$hash = md5(serialize($hashes));
echo $hash;