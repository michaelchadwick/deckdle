<?php

$HASH_ALGO = 'crc32';
$DATE_FORMAT = 'l jS \of F Y';

$deckdleEpoch = new DateTime('2024-08-25T00:00:00-0700');
$serverDate = new DateTime();

$daysSinceEpoch = $deckdleEpoch->diff($serverDate)->format('%a');

// get unique date string for today
$today = date($DATE_FORMAT);

// get integer hash for today
$hashHex = hash($HASH_ALGO, strval($today));

// get today's setupId (hex -> int)
$setupId = base_convert($hashHex, 16, 10);

echo json_encode(array(
  'index' => $daysSinceEpoch,
  'message' => 'Got daily setupId and index',
  'setupId' => $setupId,
  'status' => 'ok'
));
?>
