<?php

$HASH_ALGO = 'crc32';
$DATE_FORMAT = 'l jS \of F Y';
$tz = (new DateTimeZone('America/Los_Angeles'));

$epochDateTime = new DateTime('2024-08-26', $tz);
$serverDateTime = new DateTime('now', $tz);

// daily puzzle index is equal to number of days since epoch
$index = $epochDateTime->diff($serverDateTime)->format('%a');

// get unique date string for today
$today = date($DATE_FORMAT, $serverDateTime->getTimestamp());

// get integer hash for today
$hashHex = hash($HASH_ALGO, strval($today));

// get today's setupId (hex -> int)
$setupId = base_convert($hashHex, 16, 10);

echo json_encode(array(
  'index' => $index,
  'message' => 'Got daily setupId and index',
  'setupId' => $setupId,
  'status' => 'ok'
));
?>
