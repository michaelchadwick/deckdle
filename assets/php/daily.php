<?php

$HASH_ALGO = 'crc32';
$DATE_FORMAT = 'l jS \of F Y';
$tz = (new DateTimeZone('America/Los_Angeles'));

$epochDateTime = new DateTime('2024-08-26', $tz);
$serverDateTime = new DateTime('now', $tz);

// daily puzzle index == days since epoch (int)
$index = intval($epochDateTime->diff($serverDateTime)->format('%a'));

// get unique date string for today (int-> string)
$today = $serverDateTime->format($DATE_FORMAT);

// get integer hash for today (hex)
$hashHex = hash($HASH_ALGO, strval($today));

// get today's setupId (hex -> int)
$setupId = intval(base_convert($hashHex, 16, 10));

echo json_encode(array(
  'index' => $index,
  'message' => 'Got daily setupId and index',
  'setupId' => $setupId,
  'status' => 'ok',
));
?>
