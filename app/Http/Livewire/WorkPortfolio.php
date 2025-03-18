<?php

namespace App\Http\Livewire;

use Livewire\Component;
use App\Models\Work;
use App\Models\Category;
use Livewire\WithPagination;

class WorkPortfolio extends Component
{
    use WithPagination;
    
    public $selectedCategory = null;
    
    protected $queryString = ['selectedCategory'];
    
    public function mount($category = null)
    {
        $this->selectedCategory = $category;
    }
    
    public function filterByCategory($category = null)
    {
        $this->selectedCategory = $category;
        $this->resetPage();
        $this->dispatch('portfolioUpdated');
    }
    
    public function render()
    {
        // Get active categories (with at least one work item)
        $categories = Category::withCount('works')
            ->having('works_count', '>', 0)
            ->orderBy('name')
            ->get();
            
        // Build query for works with newest first
        $query = Work::query()->orderBy('created_at', 'desc');
        
        // Apply category filter if selected
        if ($this->selectedCategory) {
            $category = Category::where('slug', $this->selectedCategory)->first();
            if ($category) {
                $query->whereHas('categories', function($q) use ($category) {
                    $q->where('categories.id', $category->id);
                });
            }
        }
        
        $works = $query->paginate(12);
        
        return view('livewire.work-portfolio', compact('works', 'categories'));
    }
}
