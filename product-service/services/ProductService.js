export const ProductService = (repository) => {
  const getAll = async () => repository.getAll();

  const getById = async (id) => repository.getById(id);

  const create = async (product) => repository.create(product);

  const createBatch = async (records) => repository.createBatch(records);

  return { getAll, getById, create, createBatch };
};
