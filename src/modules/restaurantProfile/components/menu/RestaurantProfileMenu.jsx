import { media } from '@m/core/utils/media';
import { AppImage } from '@m/core/components/appImage/AppImage';
import { useCallback, useEffect, useState } from 'react'
import './restaurantProfileMenu.css'

import CategoryDeleteModal from '@m/core/modals/categoryDeleteModal/CategoryDeleteModal';
import RestaurantProductModal from '@m/core/modals/RestaurantProductMenuModal/RestaurantProductMenuModal';
import CategoriesAside from './CategoriesAside';
import RestaurantMenu from './RestaurantMenu';
import { useAuth } from '@m/core/hooks/useAuth';
import { renameFile, uploadFile } from '@m/core/utils/image';
import { addProduct, editProduct, getProductsByResId } from '@/api/product';
import { addSection, deleteSection } from '@/api/sections';

export function RestaurantProfileMenu() {
    const user = useAuth((state) => state.user)
    const token = useAuth((state) => state.token)

    const [categories, setCategories] = useState([])
    const [createdProduct, setCreatedProduct] = useState(null);
    const [isModalCategoriesOpen, setIsModalCategoriesOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loadingDeleteCategory, setLoadingDeleteCategory] = useState(false);
    const [isModalAddProductOpen, setIsModalAddProductOpen] = useState(false);
    const [error, setError] = useState(null);
    const [isModalEditProductOpen, setIsModalEditProductOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editedProduct, setEditedProduct] = useState(null);
    const [loadingProduct, setLoadingProduct] = useState(false);
    const [file, setFile] = useState(null)
    const [loadingCategories, setLoadingCategories] = useState(true)

    const createMyFirstCategory = async () => {
        try {
            const res = await addSection(token, { nombre_seccion: 'Mi menú' })
            const idCategory = res.data.id;
            const newCategory = {
                id: idCategory,
                nombre: 'Mi menú',
                productos: []
            }
            setCategories([...categories, newCategory])
        } catch (error) {
            console.log(error);
            setError(error)
        }
    }

    // GET CATEGORIES AND PRODUCTS

    const getMyProducts = useCallback(() => getProductsByResId(user.id).then(({ data }) => {
        setCategories(Object.entries(data).map(([id, category]) => ({
            id, nombre: category.nombre,
            productos: Object.entries(category.productos).map(([id, product]) => ({ ...product, id, uniqueKey: crypto.randomUUID() })),
        })));
    }).catch(console.error).then(() => setLoadingCategories(false)), [user.id])

    useEffect(() => {
        getMyProducts()
    }, [getMyProducts])

    // CRUD CATEGORIES

    const handleConfirmRemoveModalCategoriesClick = async () => {
        setLoadingDeleteCategory(true);
        try {
            await deleteSection(token, { id_seccion: selectedCategory.id })
            const newCategories = categories.filter(category => category.id !== selectedCategory.id);
            setCategories(newCategories);
            setIsModalCategoriesOpen(false);
            setSelectedCategory(null);
        } catch (error) {
            console.log(error);
        }
        setLoadingDeleteCategory(false);
    };

    const handleCancelModalCategoriesClick = () => {
        setIsModalCategoriesOpen(false);
    };

    // CRUD PRODUCTS

    const handleConfirmModalAddProductClick = async () => {

        setLoadingProduct(true);
        try {
            const url = await uploadFile(file, 'Products', file.name)

            const product = {
                secciones: createdProduct.categories,
                nombre: createdProduct.nombre,
                descripcion: createdProduct.descripcion,
                cost_unit: createdProduct.costo_unit,
                img_product: url,
                disponible: createdProduct.disponible ? 'true' : 'false'
            }
            const res = await addProduct(token, product)

            const newProduct = {
                ...createdProduct,
                id: res.data.response.id,
                uniqueKey: crypto.randomUUID()
            }
            const newURL = await renameFile(`Products/${file.name}`, `Products/${res.data.response.id}.png`)

            const productWithImageAndId = { ...product, img_product: newURL, id_producto: res.data.response.id }


            await editProduct(token, productWithImageAndId)

            const newCategories = categories.map(category => {
                if (newProduct.categories.includes(category.id)) {
                    return {
                        ...category,
                        productos: [...category.productos, {
                            id: newProduct.id,
                            disponible: newProduct.disponible,
                            nombre: newProduct.nombre,
                            descripcion: newProduct.descripcion,
                            img_product: newProduct.imagen,
                            costo_unit: newProduct.costo_unit
                        }]
                    }
                }
                return category
            })
            setCategories(newCategories)
            setCreatedProduct(null)
            setIsModalAddProductOpen(false);
        } catch (error) {
            console.log(error);
        }
        setLoadingProduct(false);
        setFile(null)
    }

    const handleCancelModalAddProductClick = () => {
        setCreatedProduct(null)
        setIsModalAddProductOpen(false);
    }

    const handleConfirmModalEditProductClick = async () => {
        setLoadingProduct(true);
        try {
            let image = editedProduct.img_product

            if (file) image = await uploadFile(file, 'Products', `${editedProduct.id}.png`)

            const producto = {
                id_producto: editedProduct.id,
                disponible: editedProduct.disponible ? 'true' : 'false',
                secciones: editedProduct.categories,
                nombre: editedProduct.nombre,
                descripcion: editedProduct.descripcion,
                cost_unit: editedProduct.costo_unit,
                img_product: image,
            }

            await editProduct(token, producto)
            const categoryWithoutProduct = categories.map(category => {
                return {
                    ...category,
                    productos: category.productos.filter(product => product.id !== selectedProduct.id)
                }
            })
            const newCategories = categoryWithoutProduct.map(category => {
                if (editedProduct.categories.includes(category.id)) {
                    return {
                        ...category,
                        productos: [...category.productos, {
                            uniqueKey: crypto.randomUUID(),
                            id: editedProduct.id,
                            disponible: editedProduct.disponible,
                            nombre: editedProduct.nombre,
                            descripcion: editedProduct.descripcion,
                            img_product: image,
                            costo_unit: editedProduct.costo_unit
                        }]
                    }
                }
                return category
            })
            setCategories(newCategories)
            setIsModalEditProductOpen(false);
        } catch (error) {
            console.log(error);
        }
        setLoadingProduct(false);
        setIsModalEditProductOpen(false);
    }

    const selectProductForEditing = (product) => {
        setSelectedProduct(product);
        setEditedProduct({ ...product, categories: categories.filter(category => category.productos.some(item => item.id === product.id)).map(category => category.id) });
    };

    const handleCancelModalEditProductClick = () => {
        setSelectedProduct(null)
        setIsModalEditProductOpen(false);
    }

    const handleBeginCreatingProducts = async () => {
        await createMyFirstCategory()
    }

    return (
        <>
            {
                loadingCategories
                    ? <h1>Cargando...</h1>
                    :
                    categories
                        ?
                        <>
                            <section className='RestaurantProfileMenu'>
                                {
                                    categories.length > 0
                                        ?
                                        <section className="RestaurantProfileMenu-section">
                                            <header className='RestaurantProfileMenu-header'>
                                                <h1>Menú de restaurante</h1>
                                                <button onClick={() => {
                                                    setIsModalAddProductOpen(true)
                                                    setCreatedProduct({
                                                        nombre: '',
                                                        descripcion: '',
                                                        costo_unit: '',
                                                        imagen: '',
                                                        disponible: true
                                                    })
                                                }}
                                                >Agregar producto</button>
                                            </header>
                                            <section className='RestaurantProfileMenu-manage'>

                                                <CategoriesAside categories={categories} setCategories={setCategories} setSelectedCategory={setSelectedCategory} setIsModalOpen={setIsModalCategoriesOpen} />
                                                <RestaurantMenu setEditProduct={setEditedProduct} setIsModalEditProductOpen={setIsModalEditProductOpen} setSelectedProduct={selectProductForEditing} categories={categories} setCategories={setCategories} />

                                            </section>
                                        </section>
                                        :
                                        <section className="RestaurantProfileMenu-noProducts">
                                            <AppImage draggable='false' className='RestaurantProfileMenu-noProducts-img' src={media.icons.image} alt="menu" />
                                            <h1 >Menú</h1>
                                            <h2 >Empieza a crear tu menú con todo tipo de productos y categorías</h2>
                                            <button onClick={handleBeginCreatingProducts} className="RestaurantProfileMenu-noProducts-button">Iniciar</button>
                                        </section>
                                }
                            </section>
                            <CategoryDeleteModal loadingDelete={loadingDeleteCategory} isModalOpen={isModalCategoriesOpen} handleCancelModalCategoriesClick={handleCancelModalCategoriesClick} selectedCategory={selectedCategory} handleConfirmModalCategoriesClick={handleConfirmRemoveModalCategoriesClick} />
                            <RestaurantProductModal loading={loadingProduct} setFile={setFile} loadingProduct={loadingProduct} categories={categories} isModalOpen={isModalAddProductOpen} handleCancel={handleCancelModalAddProductClick} handleConfirm={handleConfirmModalAddProductClick} setProduct={setCreatedProduct} newProduct={createdProduct} />
                            <RestaurantProductModal loading={loadingProduct} setFile={setFile} loadingProduct={loadingProduct} categories={categories} isModalOpen={isModalEditProductOpen} handleCancel={handleCancelModalEditProductClick} handleConfirm={handleConfirmModalEditProductClick} setProduct={setEditedProduct} newProduct={editedProduct} productSelectedToEdit={selectedProduct} />
                        </>
                        : error && <h1>Hubo un error al cargar los productos</h1>
            }
        </>
    )
}
