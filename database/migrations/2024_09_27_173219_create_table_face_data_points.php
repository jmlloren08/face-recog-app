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
        Schema::create('face_data_points', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id');
            $table->decimal('leftEAR', 20, 15);
            $table->decimal('rightEAR', 20, 15);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('face_data_points');
    }
};
