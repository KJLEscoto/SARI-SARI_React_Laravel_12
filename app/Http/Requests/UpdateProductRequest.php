<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        // Get the product ID from the route
        return [
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:20480',
            'name' => 'required|string|max:255|' . Rule::unique('products', 'name')->ignore($this->route('inventory')),
            // 'category' => 'required|string|max:255',
            'stock' => 'required|integer|min:0',
            'selling_price' => 'required|numeric|min:0',
            'market_price' => 'required|numeric|min:0',
            'expiration_date' => 'nullable|date',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'image.image' => 'The file must be an image.',
            'image.mimes' => 'Only JPEG, PNG, JPG, and GIF formats are allowed.',
            'image.max' => 'The image size must not exceed 20MB.',
            'name.required' => 'Product name is required.',
            'name.unique' => 'A product with this name already exists.',
            // 'category.required' => 'Category is required.',
            'stock.required' => 'Stock quantity is required.',
            'stock.integer' => 'Stock must be a valid number.',
            'selling_price.required' => 'Selling price is required.',
            'market_price.required' => 'Market price is required.',
            'expiration_date.after' => 'Expiration date must be in the future.',
        ];
    }

    // public function prepareForValidation()
    // {
    //     dd($this->route('inventory'), request()->route('inventory'));
    // }

}