export default class ValueError extends Error {
    constructor(message: string | undefined) {
        super(message)
    }
}