<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PersonDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PersonDocumentController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'person_id' => 'required|exists:persons,id',
        ]);

        $documents = PersonDocument::where('person_id', $request->person_id)->get();
        return response()->json($documents);
    }

    public function checkCedulaFolder(Request $request)
    {
        $request->validate([
            'cedula' => 'required|string',
        ]);

        $cedula = preg_replace('/[^0-9]/', '', $request->cedula);
        if (empty($cedula)) {
            return response()->json(['exists' => false]);
        }

        $folder = "documents/{$cedula}"; // Assuming standardized path
        // In the new model, we rely on DB records more than folders, but for compatibility:
        $exists = Storage::disk('public')->exists($folder);
        
        // Also check if there are database records
        $hasRecords = PersonDocument::whereHas('person', function($q) use ($cedula) {
            $q->where('cedula', $cedula);
        })->exists();

        return response()->json(['exists' => $exists || $hasRecords]);
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
