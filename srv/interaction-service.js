const cds = require('@sap/cds')
const { Interactions_Items } = cds.entities('app.interactions')
const headers = {
    'apikey': '*** API Hub key goes here ***'
}

const readFunction = async (req) => {
    console.log(req.user);
    const users = [{
        userName: req.user.id,
        role: req.user.is('authenticated-user'),
        storeID: req.user.attr.StoreId
    }]
    return users;
}

/** Service implementation for CatalogService */
module.exports = cds.service.impl(async function () {
    console.log(`Service Name: ${this.name} --- Service Path: ${this.path}`)
    // this.before('*', req =>
    //     req.user.is('authenticated-user') || req.reject(403)
    // )
    this.before(['CREATE'], 'Interactions_Header', req =>
        req.user.is('Administrator') || req.reject(403)
    )

    // Getting data from ES5 system
    const { BusinessPartners, API_BP, API_BP_Full } = this.entities
    const bupaSrv = await cds.connect.to('GW_SAMPLE_BASIC')
    this.on('READ', BusinessPartners, req => bupaSrv.tx(req).run(req.query))
    // this.on('READ', BusinessPartners, (req) => {
    //     // console.log(req.query)
    //     console.log('getting data from ES5 gateway system')
    //     return bupaSrv.tx(req).run(req.query)
    // })
    // this.on('READ', BusinessPartners, req => bupaSrv.tx(req).get('/BusinessPartnerSet'))

    // Getting data from API Business Hub S/4HANA Sandbox system
    const bupaSrvAPI = await cds.connect.to('API_BUSINESS_PARTNER')
    this.on('READ', API_BP, async (req) => {
        console.log('getting data from API Hub S/4HANA Sandbox System ')
        const query = req.query
        // console.log(query)
        // const partners = await bupaSrvAPI.send({ query, headers })
        // return partners
        return bupaSrvAPI.send({ query, headers })
    })

    this.on('READ', 'UserInfo', readFunction)

    // Reduce stock of ordered books if available stock suffices
    this.on('submitItem', async req => {
        const { HeaderID, TextID, TextVal, Lang } = req.data
        // let {stock} = await SELECT `stock` .from (Books,book)
        // if (stock >= amount) {
        // await UPDATE (Books,book) .with (`stock -=`, amount)
        // await this.emit ('OrderedBook', { book, amount, buyer:req.user.id })
        // return { stock }
        // }
        // else return req.error (409,`${amount} exceeds stock for book #${book}`)
        // await UPSERT(Interactions_Items, book).values()

        // let query = cds.parse.cql (`SELECT from Foo`)
        // let query = SELECT.from('Foo')
        // let query = {SELECT:{from:[{ref:['Foo']}]}}
        // cds.run (query)

        // let query = {
        //     INSERT: {
        //         into: { ref: ['Interactions_Items'] },
        //         entries: [{INTHeader: HeaderID, TEXT_ID: TextID, LANGU: Lang, LOGTEXT: TextVal}]
        //     }
        // }

        // let query = UPSERT.into(Interactions_Items).entries(
        //     { INTHeader: HeaderID, TEXT_ID: TextID, LANGU: Lang, LOGTEXT: TextVal }
        // )
        // let result = cds.run(query)
        let result = await INSERT.into(Interactions_Items).entries(
            { INTHeader: HeaderID, TEXT_ID: TextID, LANGU: Lang, LOGTEXT: TextVal }
        )
        let res = true
        return { res }
    })
})
