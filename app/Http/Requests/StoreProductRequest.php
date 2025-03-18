<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:20480',
            'name' => 'required|string|max:255|unique:products,name',
            // 'category' => 'required|string|max:255',
            'stock' => 'required|integer|min:0',
            'selling_price' => 'required|numeric|min:0',
            'market_price' => 'required|numeric|min:0',
            'expiration_date' => 'nullable|date|after:today',
        ];
    }

    public function messages()
    {
        return [
            'image.image' => 'The file must be an image.',
            'image.mimes' => 'Only JPEG, PNG, JPG, and GIF formats are allowed.',
            'image.max' => 'The image size must not exceed 2MB.',
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
}