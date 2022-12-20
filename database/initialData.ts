import bcryptjs from 'bcryptjs'

export const initialData = {
    entries: [],
    imagenes: [],
    categories: [
        {
            title: 'Política',
            slug: 'politica',
            tag: 'Politica',
            position: 1,
            type: 'category'
        },
        {
            title: 'Mundo',
            slug: 'mundo',
            tag: 'Mundo',
            position: 2,
            type: 'category'
        },
        {
            title: 'México',
            slug: 'mexico',
            tag: 'México',
            position: 3,
            type: 'category'
        },
        {
            title: 'Guerrero',
            slug: 'guerrero',
            tag: 'Guerrero',
            position: 4,
            type: 'category'
        },
        {
            title: 'Región de la Montaña',
            slug: 'region-de-la-montana',
            tag: 'Montaña',
            position: 5,
            type: 'category'
        },
        {
            title: 'Economía',
            slug: 'economia',
            tag: 'Economía',
            position: 6,
            type: 'category'
        },
        {
            title: 'Deportes',
            slug: 'deportes',
            tag: 'Deportes',
            position: 7,
            type: 'category'
        },
        {
            title: 'Cultura',
            slug: 'cultura',
            tag: 'Cultura',
            position: 8,
            type: 'category'
        },
        {
            title: 'Opinión',
            slug: 'opinion',
            tag: 'Opinión',
            position: 9,
            type: 'category'
        },
    ],
    subcategories: [
        {
            title: 'Tlapa de Comonfort',
            slug: 'tlapa-de-comonfort',
            tag: 'Tlapa',
            position: 1,
            type: 'subcategory',
            category: '62f490278af515f643b95ecf'
        },
        {
            title: 'Malinaltepec',
            slug: 'malinaltepec',
            tag: 'Malinaltepec',
            position: 2,
            type: 'subcategory',
            category: '62f490278af515f643b95ecf'
        },
        {
            title: 'Alpoyeca',
            slug: 'alpoyeca',
            tag: 'Alpoyeca',
            position: 3,
            type: 'subcategory',
            category: '62f490278af515f643b95ecf'
        },
        {
            title: 'Xochihuehuetlán',
            slug: 'xochihuehuetlan',
            tag: 'Xochihuehuetlán',
            position: 4,
            type: 'subcategory',
            category: '62f490278af515f643b95ecf'
        },
        {
            title: 'Tlacoapa',
            slug: 'tlacoapa',
            tag: 'Tlacoapa',
            position: 5,
            type: 'subcategory',
            category: '62f490278af515f643b95ecf'
        },
        {
            title: 'Cochoapa el Grande',
            slug: 'cochoapa-el-grande',
            tag: 'Cochoapa',
            position: 6,
            type: 'subcategory',
            category: '62f490278af515f643b95ecf'
        },
        {
            title: 'Olinalá',
            slug: 'olinala',
            tag: 'Olinalá',
            position: 7,
            type: 'subcategory',
            category: '62f490278af515f643b95ecf'
        },
        {
            title: 'Iliatenco',
            slug: 'iliatenco',
            tag: 'Iliatenco',
            position: 8,
            type: 'subcategory',
            category: '62f490278af515f643b95ecf'
        },
        {
            title: 'Acapulco',
            slug: 'acapulco',
            tag: 'Acapulco',
            position: 9,
            type: 'subcategory',
            category: '62f490278af515f643b95ece'
        },
        {
            title: 'Chilpancingo',
            slug: 'chilpancingo',
            tag: 'Chilpancingo',
            position: 10,
            type: 'subcategory',
            category: '62f490278af515f643b95ece'
        },
    ],
    authors: [
        {
            name: 'Contextos Guerrero',
            slug: 'contextos-guerrero',
            facebook: 'tonatiujsanchez',
            twitter: 'tonatiujsanchez',
            instagram: 'tonatiujsanchez',
            email: 'correo@correo.com',
            phone: '536 123 2354',
            web: 'www.contextosguerrero.com',
            occupation: 'Periodista',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis deserunt aspernatur neque excepturi facere repellendus autem, porro eligendi alias, quibusdam eveniet.',
            photo: 'https://zenix.dexignzone.com/xhtml/images/contacts/Untitled-5.jpg'
        },
        {
            name: 'Norma Irene de la Cruz Magaña',
            slug: 'norma-irene-de-la-cruz-magana',
            facebook: '',
            twitter: '',
            instagram: '',
            email: 'correo@correo.com',
            phone: '536 123 2354',
            web: 'www.contextosguerrero.com',
            occupation: 'Lic. En Comunicación',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis deserunt aspernatur neque excepturi facere repellendus autem, porro eligendi alias, quibusdam eveniet.',
            photo: 'https://zenix.dexignzone.com/xhtml/images/contacts/Untitled-1.jpg'
        },
        {
            name: 'Jorge Álvarez Hoth',
            slug: 'jorge-alvarez-hoth',
            facebook: '',
            twitter: '',
            instagram: '',
            email: 'correo@correo.com',
            phone: '536 123 2354',
            web: 'www.contextosguerrero.com',
            occupation: 'Economista y Analista',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis deserunt aspernatur neque excepturi facere repellendus autem, porro eligendi alias, quibusdam eveniet.',
            photo: 'https://zenix.dexignzone.com/xhtml/images/contacts/Untitled-4.jpg'
        },
        {
            name: 'Luis Cárdenas',
            slug: 'luis-cardenas',
            facebook: '',
            twitter: '',
            instagram: '',
            email: 'correo@correo.com',
            phone: '536 123 2354',
            web: 'www.contextosguerrero.com',
            occupation: 'Conductor y Periodista',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis deserunt aspernatur neque excepturi facere repellendus autem, porro eligendi alias, quibusdam eveniet.',
            photo: 'https://www.eluniversal.com.mx/sites/default/files/styles/f01-383x568_corte_1_u2020_/public/autores/opinion/2021/02/22/hector-de-mauleon.png'
        },
        {
            name: 'Cindy Hernandez',
            slug: 'cindy-hernandez',
            facebook: '',
            twitter: '',
            instagram: '',
            email: 'correo@correo.com',
            phone: '536 123 2354',
            web: 'www.contextosguerrero.com',
            occupation: 'Escritora y Analista',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis deserunt aspernatur neque excepturi facere repellendus autem, porro eligendi alias.',
            photo: 'https://zenix.dexignzone.com/xhtml/images/contacts/Untitled-2.jpg'
        },
        {
            name: 'Olivia Cardoso',
            slug: 'olivia-cardoso',
            facebook: '',
            twitter: '',
            instagram: '',
            email: 'correo@correo.com',
            phone: '536 123 2354',
            web: 'www.contextosguerrero.com',
            occupation: 'Politíca y Escritora',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis deserunt aspernatur neque excepturi facere repellendus autem, porro eligendi alias.',
            photo: 'https://zenix.dexignzone.com/xhtml/images/contacts/Untitled-3.jpg'
        },
    ],
    users: [
        {
            name: 'Contextos Gro',
            email: 'contextosguerrero@gmail.com',
            password: bcryptjs.hashSync('123456'),
            role: 'editor',
            photo:'https://res.cloudinary.com/contextos-guerrero/image/upload/v1662093747/icon_le1rhi.png'
        }
    ]
}