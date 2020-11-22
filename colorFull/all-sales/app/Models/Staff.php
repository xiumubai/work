<?php

namespace App\Models;

use Laratrust\Traits\LaratrustUserTrait;

class Staff extends Model
{
    use LaratrustUserTrait;

    protected $table = 'staffs';

}
