<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Runner\Baseline\Baseline;

class ImageController extends Controller
{
    public function getImages()
    {
        // get all image files from the public disk under 'images' folder
        $files = Storage::disk('public')->files('images');
        // extract filenames from the path
        $imageFilenames = [];
        foreach ($files as $file) {
            $imageFilenames[] = basename($file);
        }
        // return the filename as a JSON response
        return response()->json($imageFilenames);
    }
}
