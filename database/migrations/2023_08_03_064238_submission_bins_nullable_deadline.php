<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('submission_bins', function (Blueprint $table) {
            //
            $table->date('deadline_date')->nullable()->change();
            $table->time('deadline_time')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submission_bins', function (Blueprint $table) {
            //
        });
    }
};
