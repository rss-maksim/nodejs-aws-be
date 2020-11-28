import { getProductsList } from './getProductsList'
import { products } from '../service/products'
import { toSuccess } from '../../core/response';

describe('getProductsList tests', () => {
    test('should return products list', async () => {
        const response = toSuccess(products)
        
        await expect(getProductsList(null, null, null)).resolves.toEqual(response);
    });
  });