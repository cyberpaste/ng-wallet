<?php

namespace App\Base;

trait ArrayExpressible {
    public function toArray() {
        return get_object_vars($this);
    }
}