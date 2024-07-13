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
        Schema::dropIfExists('report_comments');
        Schema::create('report_comments', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('comment', 1000);
            $table->boolean('is_removed')->default(false);

            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();

            $table->unsignedBigInteger('unit_head_id');
            $table->unsignedBigInteger('submission_bin_id');

            $table->foreign('unit_head_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('submission_bin_id')->references('id')->on('submission_bins')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('report_comments', function (Blueprint $table) {
            //
        });
    }
};
