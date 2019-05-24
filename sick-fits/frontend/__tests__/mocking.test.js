class Person {
    constructor(name, foods) {
        this.name = name;
        this.foods = foods;
    }

    fetchFavFoods = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.foods);
            }, 2000);
        })
    }
}

describe('mocking learning', () => {
    it('mocks a reg function', () => {
        const fetchDogs = jest.fn();
        fetchDogs();
        expect(fetchDogs).toHaveBeenCalled();
        fetchDogs('snickers');
        expect(fetchDogs).toHaveBeenCalledWith('snickers');
        expect(fetchDogs).toHaveBeenCalledTimes(2);
    });

    it('can create a person', () => {
        const me = new Person('Juan', ['pizza', 'burgers']);
        expect(me.name).toBe('Juan');
    });

    it('can fetch foods', async () => {
        const me = new Person('Juan', ['pizza', 'burgers']);
        // mock favFoods function
        me.fetchFavFoods = jest.fn().mockResolvedValue(['pizza', 'spaghetti']);

        const favFoods = await me.fetchFavFoods();
        expect(favFoods).toContain('pizza');
    });
});