<?php

use App\Models\Company;
use Illuminate\Database\Seeder;

class OrgSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $company = Company::create();
    }
}
