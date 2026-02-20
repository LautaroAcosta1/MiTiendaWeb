import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductList from '../ProductList';
import api from '../../api/axios';

vi.mock('../../api/axios', () => {
    return {
        default: {
            delete: vi.fn()
        }
    };
});

describe('ProductList', () => {
    const mockProducts = [
        { _id: '1', name: 'Mate Goma', price: 500, description: '...', image: '...', category: { _id: '1', name: 'Mates' } },
        { _id: '2', name: 'Termo Acero', price: 1500, description: '...', image: '...', category: { _id: '2', name: 'Termos' } }
    ];
    const mockLoad = vi.fn();
    const mockSetEditingProduct = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        window.confirm = vi.fn(() => true);
    });

    it('renders standard products list', () => {
        render(
            <ProductList
                products={mockProducts}
                editingProduct={null}
                setEditingProduct={mockSetEditingProduct}
                load={mockLoad}
            />
        );
        expect(screen.getByText('Mate Goma - $500')).toBeInTheDocument();
        expect(screen.getByText('Termo Acero - $1500')).toBeInTheDocument();
    });

    it('filters products by search input', () => {
        render(
            <ProductList
                products={mockProducts}
                editingProduct={null}
                setEditingProduct={mockSetEditingProduct}
                load={mockLoad}
            />
        );
        const searchInput = screen.getByPlaceholderText('Buscar producto...');
        fireEvent.change(searchInput, { target: { value: 'Mate' } });

        expect(screen.getByText('Mate Goma - $500')).toBeInTheDocument();
        expect(screen.queryByText('Termo Acero - $1500')).not.toBeInTheDocument();
    });

    it('calls setEditingProduct when edit is clicked', () => {
        render(
            <ProductList
                products={mockProducts}
                editingProduct={null}
                setEditingProduct={mockSetEditingProduct}
                load={mockLoad}
            />
        );
        const editButtons = screen.getAllByText('Editar');
        fireEvent.click(editButtons[0]);
        expect(mockSetEditingProduct).toHaveBeenCalledWith(mockProducts[0]);
    });

    it('deletes a product upon confirmation', async () => {
        api.delete.mockResolvedValueOnce({});
        render(
            <ProductList
                products={mockProducts}
                editingProduct={null}
                setEditingProduct={mockSetEditingProduct}
                load={mockLoad}
            />
        );

        const deleteButtons = screen.getAllByText('Eliminar');
        fireEvent.click(deleteButtons[1]); // Delete the second one

        expect(window.confirm).toHaveBeenCalledWith('¿Seguro que querés eliminar el producto "Termo Acero"?');

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/products/2');
            expect(mockLoad).toHaveBeenCalled();
        });
    });
});
