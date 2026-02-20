import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CategoryManager from '../CategoryManager';
import api from '../../api/axios';

// Mock the API module
vi.mock('../../api/axios', () => {
    return {
        default: {
            post: vi.fn(),
            delete: vi.fn()
        }
    };
});

describe('CategoryManager', () => {
    const mockCategories = [
        { _id: '1', name: 'Mates' },
        { _id: '2', name: 'Termos' }
    ];
    const mockLoad = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        window.confirm = vi.fn(() => true); // Mock confirm dialog to always return true
    });

    it('renders a list of categories', () => {
        render(<CategoryManager categories={mockCategories} load={mockLoad} />);
        expect(screen.getByText('Mates')).toBeInTheDocument();
        expect(screen.getByText('Termos')).toBeInTheDocument();
    });

    it('allows adding a new category', async () => {
        api.post.mockResolvedValueOnce({ data: { _id: '3', name: 'Bombillas' } });
        render(<CategoryManager categories={mockCategories} load={mockLoad} />);

        const input = screen.getByPlaceholderText('Nueva categoría');
        fireEvent.change(input, { target: { value: 'Bombillas' } });

        const addButton = screen.getByText('Agregar');
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/categories', { name: 'Bombillas' });
            expect(mockLoad).toHaveBeenCalled();
        });
    });

    it('prevents adding empty category', async () => {
        render(<CategoryManager categories={mockCategories} load={mockLoad} />);

        const addButton = screen.getByText('Agregar');
        fireEvent.click(addButton);

        expect(api.post).not.toHaveBeenCalled();
        expect(mockLoad).not.toHaveBeenCalled();
    });

    it('handles category deletion with confirmation', async () => {
        api.delete.mockResolvedValueOnce({});
        render(<CategoryManager categories={mockCategories} load={mockLoad} />);

        // Click delete on the first category (Mates)
        const deleteButtons = screen.getAllByText('Eliminar');
        fireEvent.click(deleteButtons[0]);

        expect(window.confirm).toHaveBeenCalledWith('¿Seguro que querés eliminar la categoría "Mates"?');

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/categories/1');
            expect(mockLoad).toHaveBeenCalled();
        });
    });
});
