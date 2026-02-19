<?
  function url(){
    return sprintf(
      "%s://%s%s",
      isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
      $_SERVER['SERVER_NAME'],
      preg_replace( '/\/(htdocs|www)/', '', dirname($_SERVER['SCRIPT_NAME']) )
    );
  }

  function isVK(){
    return testUserAgent('vkShare');
  }
  function isFB(){
    return testUserAgent('facebookexternalhit');
  }
  function testUserAgent($str) {
    return stripos($_SERVER['HTTP_USER_AGENT'], $str) !== FALSE;
  }

  function request_url() {
    return sprintf(
      "%s://%s%s",
      isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
      $_SERVER['SERVER_NAME'],
      $_SERVER['REQUEST_URI']
    );
  }
  function base_url($val) {
    return url() . $val;
  }

  function getShare(){
    $result = new stdClass();
    $result->title = 'Перцы';
    $result->description = 'digital production studio';
    $result->image = base_url('images/share.jpg');
    $result->canonical_url = request_url();

  	// Проверка _GET параметров и подмена текста и картинок

    if (isVK()) {
      $result->title = "$result->title $result->description";
    }
    return $result;
  }

  $share = getShare();
?>
