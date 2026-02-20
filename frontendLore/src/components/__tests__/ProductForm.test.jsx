import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductForm from '../ProductForm';
import api from '../../api/axios';

vi.mock('../../api/axios', () => {
    return {
        default: {
            post: vi.fn(),
            put: vi.fn()
        }
    };
});

describe('ProductForm', () => {
    const mockCategories = [
        { _id: '1', name: 'Mates' }
    ];
    const mockLoad = vi.fn();
    const mockSetEditingProduct = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders create mode correctly', () => {
        render(
            <ProductForm
                categories={mockCategories}
                editingProduct={null}
                setEditingProduct={mockSetEditingProduct}
                load={mockLoad}
            />
        );
        expect(screen.getByRole('heading', { name: "Crear producto" })).toBeInTheDocument();
    });

    it('renders edit mode with prefilled data', () => {
        const editingProduct = {
            _id: '10',
            name: 'Termo Editado',
            price: 1200,
            description: 'Prueba',
            stock: 5,
            category: { _id: '1' }
        };

        render(
            <ProductForm
                categories={mockCategories}
                editingProduct={editingProduct}
                setEditingProduct={mockSetEditingProduct}
                load={mockLoad}
            />
        );

        expect(screen.getByText('Editar producto')).toBeInTheDocument();

        // Check if the input value matches the prefilled data
        const nameInput = screen.getByPlaceholderText('Nombre');
        expect(nameInput.value).toBe('Termo Editado');

        const cancelButton = screen.getByText('Cancelar');
        expect(cancelButton).toBeInTheDocument();
    });

    it('handles creation form submission successfully', async () => {
        api.post.mockResolvedValueOnce({});
        render(
            <ProductForm
                categories={mockCategories}
                editingProduct={null}
                setEditingProduct={mockSetEditingProduct}
                load={mockLoad}
            />
        );

        // Fill form
        fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'Nuevo Termo' } });
        fireEvent.change(screen.getByPlaceholderText('Precio'), { target: { value: '2500' } });
        fireEvent.change(screen.getByPlaceholderText('Stock'), { target: { value: '10' } });

        const categorySelect = screen.getByRole('combobox');
        fireEvent.change(categorySelect, { target: { value: '1' } });

        // Mock file input selection
        const fileInput = screen.getAllByRole('textbox').find(el => el.type === 'file') || document.querySelector('input[type="file"]');
        const mockFile = new File(['hello'], 'hello.png', { type: 'image/png' });
        fireEvent.change(fileInput, { target: { files: [mockFile] } });

        // Submit
        const submitBtn = screen.getByRole('button', { name: "Crear producto" });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalled();
            expect(mockLoad).toHaveBeenCalled();
        });
    });
});
