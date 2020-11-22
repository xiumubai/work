<?php
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LaratrustSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return  void
     */
    public function run()
    {
        $this->command->info('Truncating User, Role and Permission tables');
        $this->truncateLaratrustTables();

        $rolesPermission = config('laratrust_seeder.role_structure');
        $userPermission = config('laratrust_seeder.permission_structure');
        $mapPermission = collect(config('laratrust_seeder.permissions_map'));
        $mapModules = collect(config('laratrust_seeder.modules_map'));

        foreach ($rolesPermission as $key => $role) {

            $role_permissions = $role['permissions'];

            // Create a new role
            $role = \App\Models\Role::create([
                'name' => $key,
                'display_name' => $role['display_name'],
                'description' => $role['description'] ?? '',
            ]);
            $permissions = [];

            $this->command->info('Creating Role: '. ($key));

            // Reading role permission modules
            foreach ($role_permissions as $module => $role_module_permissions) {

                foreach (explode(',', $role_module_permissions) as $module_permission) {

                    $permissionTitle = $mapPermission->get($module_permission);
                    $permissions[] = \App\Models\Permission::firstOrCreate([
                        'name' => $module_permission . '-' . $module,
                        'display_name' => $permissionTitle . $mapModules->get($module),
                        'description' => '',
                    ])->id;

                    $this->command->info('Creating Permission to '.$module_permission.' for '. $module);
                }
            }

            // Attach all permissions to the role
            $role->permissions()->sync($permissions);
        }
    }

    /**
     * Truncates all the laratrust tables and the users table
     *
     * @return    void
     */
    public function truncateLaratrustTables()
    {
        Schema::disableForeignKeyConstraints();
        DB::table('permission_role')->truncate();
        DB::table('permission_staff')->truncate();
        DB::table('role_staff')->truncate();
        \App\Models\Staff::truncate();
        \App\Models\Role::truncate();
        \App\Models\Permission::truncate();
        Schema::enableForeignKeyConstraints();
    }
}
