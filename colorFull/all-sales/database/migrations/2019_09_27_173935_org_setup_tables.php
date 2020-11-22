<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class OrgSetupTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('companies', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->unsignedInteger('updated_at')->default(0);
            $table->unsignedInteger('created_at')->default(0);
        });

        Schema::create('departments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('company_id');
            $table->string('name');
            $table->unsignedBigInteger('parent_id');
            $table->string('parent_path');
            $table->unsignedInteger('depth');
            $table->unsignedInteger('updated_at')->default(0);
            $table->unsignedInteger('created_at')->default(0);

            $table->unique(['company_id', 'parent_id', 'name']);
        });

        Schema::create('staffs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('company_id');
            $table->string('true_name');
            $table->string('job_number');
            $table->string('position')->default('')->comment('职位');
            $table->unsignedTinyInteger('is_activated')->default(0)->comment('状态：0未激活 1已激活(前台登陆过)');
            $table->string('remark', 1000)->default('')->comment('备注');
            $table->unsignedBigInteger('total_point')->default(0);
            $table->unsignedBigInteger('useable_point')->default(0);

            $table->unsignedInteger('updated_at')->default(0);
            $table->unsignedInteger('created_at')->default(0);
        });

        Schema::create('department_staff', function (Blueprint $table) {
            $table->unsignedBigInteger('department_id');
            $table->unsignedBigInteger('staff_id');
            $table->unsignedInteger('order')->default(0)->comment('员工在部门的显示顺序(备用)');
            $table->unsignedInteger('updated_at')->default(0);
            $table->unsignedInteger('created_at')->default(0);

            $table->primary(['department_id', 'staff_id']);
        });

        Schema::create('department_admin', function (Blueprint $table) {
            $table->unsignedBigInteger('department_id');
            $table->unsignedBigInteger('staff_id');
            $table->unsignedInteger('updated_at')->default(0);
            $table->unsignedInteger('created_at')->default(0);

            $table->primary(['department_id', 'staff_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('department_admin');
        Schema::dropIfExists('department_staff');
        Schema::dropIfExists('staffs');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('companies');
    }
}
