<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PersonDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use Illuminate\Support\Facades\Log;

class PersonDocumentController extends Controller
{
    // ...

    public function checkCedulaFolder(Request $request)
    {
        $request->validate([
            'cedula' => 'required|string',
        ]);

        $rawCedula = $request->cedula;
        $strippedCedula = preg_replace('/[^0-9]/', '', $request->cedula);
        
        Log::info("Checking cedula folder/records for: {$rawCedula} (Stripped: {$strippedCedula})");

        if (empty($strippedCedula)) {
            return response()->json(['exists' => false]);
        }

        $folder = "documents/{$strippedCedula}"; 
        $legacyFolder = "documentos/{$strippedCedula}";

        $exists = Storage::disk('public')->exists($folder) || Storage::disk('public')->exists($legacyFolder);
        
        $hasRecords = PersonDocument::whereHas('person', function($q) use ($strippedCedula, $rawCedula) {
            $q->where('cedula', $strippedCedula)
              ->orWhere('cedula', $rawCedula);
        })->exists();

        Log::info("Result - Folder: " . ($exists ? 'Yes' : 'No') . ", DB Records: " . ($hasRecords ? 'Yes' : 'No'));

        return response()->json(['exists' => $exists || $hasRecords]);
    }
    
    // ...
}

    public function store(Request $request)
    {
        $request->validate([
            'person_id' => 'required|exists:persons,id',
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $path = $file->store('documents', 'public');

        $document = PersonDocument::create([
            'person_id' => $request->person_id,
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'url' => asset(Storage::url($path)),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);

        return response()->json($document, 201);
    }

    public function destroy($id)
    {
        $document = PersonDocument::findOrFail($id);

        if (Storage::disk('public')->exists($document->path)) {
            Storage::disk('public')->delete($document->path);
        }

        $document->delete();

        return response()->json(['message' => 'Document deleted successfully']);
    }
}
