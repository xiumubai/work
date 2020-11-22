<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class LaratrustSetupTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return  void
     */
    public function up()
    {

        // Create table for storing roles
        Schema::create('roles', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique()->comment('角色唯一标识名称');
            $table->string('display_name')->default('')->comment('角色展示用名称');
            $table->string('description')->default('')->comment('角色描述');
            $table->unsignedTinyInteger('deleteable')->default(0)->comment('该角色是否可删除(备用)');
            $table->unsignedInteger('updated_at')->default(0);
            $table->unsignedInteger('created_at')->default(0);
        });

        // Create table for storing permissions
        Schema::create('permissions', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique()->comment('权限唯一标识名称');
            $table->string('display_name')->default('')->comment('权限展示用名称');
            $table->string('description')->default('')->comment('权限描述');
            $table->unsignedInteger('updated_at')->default(0);
            $table->unsignedInteger('created_at')->default(0);
        });

        // Create table for associating roles to users and teams (Many To Many Polymorphic)
        Schema::create(config('laratrust.tables.role_user', 'role_user'), function (Blueprint $table) {
            $table->unsignedInteger('role_id');
            $table->unsignedInteger(config('laratrust.foreign_keys.user'));
            $table->string('user_type');

            $table->foreign('role_id')->references('id')->on('roles')
                ->onUpdate('cascade')->onDelete('cascade');

            $table->primary([config('laratrust.foreign_keys.user', 'user_id'), 'role_id', 'user_type']);
        });

        // Create table for associating permissions to users (Many To Many Polymorphic)
        Schema::create(config('laratrust.tables.permission_user', 'permission_user'), function (Blueprint $table) {
            $table->unsignedInteger('permission_id');
            $table->unsignedInteger(config('laratrust.foreign_keys.user'));
            $table->string('user_type');

            $table->foreign('permission_id')->references('id')->on('permissions')
                ->onUpdate('cascade')->onDelete('cascade');

            $table->primary([config('laratrust.foreign_keys.user', 'user_id'), 'permission_id', 'user_type']);
        });

        // Create table for associating permissions to roles (Many-to-Many)
        Schema::create('permission_role', function (Blueprint $table) {
            $table->unsignedInteger('permission_id');
            $table->unsignedInteger('role_id');

            $table->foreign('permission_id')->references('id')->on('permissions')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('role_id')->references('id')->on('roles')
                ->onUpdate('cascade')->onDelete('cascade');

            $table->primary(['permission_id', 'role_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return  void
     */
    public function down()
    {
        Schema::dropIfExists(config('laratrust.tables.permission_user', 'permission_user'));
        Schema::dropIfExists('permission_role');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists(config('laratrust.tables.role_user', 'role_user'));
        Schema::dropIfExists('roles');
    }
}
