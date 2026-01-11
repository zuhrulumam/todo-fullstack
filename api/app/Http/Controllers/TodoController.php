<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    public function index()
    {
        return response()->json(Todo::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $todo = Todo::create([
            'title' => $validated['title'],
            'completed' => false,
        ]);

        return response()->json($todo, 201);
    }

    public function update(Request $request, $id)
    {
        $todo = Todo::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'completed' => 'sometimes|boolean',
        ]);

        $todo->update($validated);

        return response()->json($todo);
    }

    public function destroy($id)
    {
        $todo = Todo::findOrFail($id);
        $todo->delete();

        return response()->json(null, 204);
    }
}