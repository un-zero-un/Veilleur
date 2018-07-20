<?php

namespace AppBundle\Resources;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class JsResponse extends Response
{

    public function __construct($js = '', int $status = 200, array $headers = array())
    {
        parent::__construct($js, $status, $headers);
    }

    public function setJS($js)
    {
        $val =<<<HTML
<!doctype HTML>
<html>
    <body>
        <script type="text/javascript">
            $js
        </script>
    </body>
</html>
HTML;
        return $this->setContent($val);
    }

}