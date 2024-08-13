<?php

$HASH_ALGO = 'crc32';
$DATE_FORMAT = 'l jS \of F Y';

$deckdleEpoch = new DateTime('2024-08-04T00:00:00-0700');
$serverDate = new DateTime();

$daysSinceEpoch = $deckdleEpoch->diff($serverDate)->format('%a');

// get unique date string for today
$today = date($DATE_FORMAT);

// get integer hash for today
$hashHex = hash($HASH_ALGO, strval($today));
$hashInt = base_convert($hashHex, 16, 10);

// get today's setupId (will be split for stock and tableau)
$setupId = $hashInt;

echo json_encode(array(
  'index' => $daysSinceEpoch,
  'message' => 'Got daily tableau, stock, and index',
  'setupId' => $setupId,
  'status' => 'ok'
));
?>
