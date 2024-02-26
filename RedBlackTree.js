// Правила красно-черного дерева:
// 1. Узел должен быть красным или черным и может иметь два дочерних узла.
// 2. Корень дерева должен быть черным.
// 3. Все листья без значения черные.
// 4. Оба дочерних узла красного узла черные.
// 5. На каждом пути от родителя к потомку должно быть одинаковое количество черных узлов.

// цвета для дерева
const colors = {
    red: 'red',
    black: 'black'
}


// узел для дерева
// указываем значение, цвет, левый и правый дочерний узел, родительский узел
class redBlackTreeNode {
    constructor(param) {
        this.key = param.key || 0;
        this.color = param.color || colors.red;
        this.left = param.left || undefined;
        this.right = param.right || undefined;
        this.parent = param.parent || undefined;
    }
}


// дерево
class redBlackTree {
    constructor() {
        this.leaf = new redBlackTreeNode({key: 0, color: colors.black});
        this.root = this.leaf;
    }

    // вставка в дерево - обход дерева в цикле,
    // если ключ меньше ключа текущего узла, необходимо искать в левом узле,
    // иначе в правом;
    // после вставки проверяем баланс дерева
    // параметр key - значение узла
    insertNode(key) {
        const node = new redBlackTreeNode({
            key,
            left: this.leaf,
            right: this.leaf
        });

        let parent;
        let tmp = this.root;

        // поиск родителя для нового узла,
        // проверяем все узлы, пока не получим пустой лист
        while (tmp !== this.leaf) {
            parent = tmp;

            // если значение меньше значения текущего узла,
            // то ищем в левом узле,
            if (node.key < tmp.key) {
                tmp = tmp.left;
            }
            // иначе в правом
            else {
                tmp = tmp.right;
            }
        }

        node.parent = parent;

        // вставляем в левый или правый узел
        if (!parent) {
            this.root = node;
        }
        else if (node.key < parent.key) {
            parent.left = node;
        }
        else {
            parent.right = node;
        }

        // если дерево не имеет вершины, то узел будет корнем
        if (!node.parent) {
            node.color = colors.black;
            return;
        }

        // у узла нет предка, поэтому надо сбалансировать дерево
        if (!node.parent.parent) {
            return;
        }

        // балансировка дерева
        this.balanceInsert(node);
    }


    // балансировка дерева после вставки:
    // 1) произвести балансировку, пока родительский узел - красный
    // 2) если родитель узла - левый дочерний узел дедушки/бабушки:
    //      а) если дядя и родитель красные, можно изменить цвет дяди и родителя на черный,
    //      сделать дедушку/бабушку красными и применить балансировку для дедушки/бабушки, чтобы соблюсти правило 4
    //      б) если родитель красный, а дядя черный:
    //      если узел правый дочерний узел,
    //      применить балансировку к родительскому узлу и изменить положение на левое,
    //      потом сделать родителя - черным, а дедушку и бабушку - красным
    //      изменить положение на правое для дедушки/бабушки
    // 3) если родитель узла - правый дочерний узел дедушки/бабушки:
    //      а) если родитель и дядя красные, то сделать их черными, а дедушку/бабушку - красными
    //      после применить балансировку к дедушке/бабушке
    //      б) иначе, если узел - левый дочерний узел мы продолжаем балансировку от родителя и изменяем положение на левое
    //      после того, как родитель станет черным, сделать родительский узел красным и
    //      изменить его положение на правое
    // 4) устанавливаем черный цвет для корня
    // параметр node - узел для балансировки
    balanceInsert(node) {
        while (node.parent.color === colors.red) {

            // если родительский узел - дочерний узел дедушки/бабушки
            if (node.parent === node.parent.parent.left) {
                const uncle = node.parent.parent.right;

                // если родитель и дядя красные, сделать их черными, а дедушку/бабушку - красными
                if (uncle.color === colors.red) {
                    uncle.color = colors.black;
                    node.parent.color = colors.black;
                    node.parent.parent.color = colors.red;
                    node = node.parent.parent;
                }

                // если родитель красные, а дядя черный
                else {
                    // если узел - правый дочерний
                    if (node === node.parent.right) {
                        node = node.parent;
                        this.rotateLeft(node);
                    }
                    node.parent.color = colors.black;
                    node.parent.parent.color = colors.red;
                    this.rotateRight(node.parent.parent);
                }
            }
            else {
                const uncle = node.parent.parent.left;
                if (uncle.color === colors.red) {
                    uncle.color = colors.black;
                    node.parent.color = colors.black;
                    node.parent.parent.color = colors.red;
                    node = node.parent.parent;
                }
                else {
                    if (node == node.parent.left) {
                        node = node.parent;
                        this.rotateRight(node);
                    }
                    node.parent.color = colors.black;
                    node.parent.parent.color = colors.red;
                    this.rotateLeft(node.parent.parent);
                }
            }
            if (node == this.root) {
                break;
            }
        }
        this.root.color = colors.black;
    }


    // метод изменения положения узлов на левое:
    // правый дочерний узел становится новой вершиной,
    // предыдущая вершина становится левым дочерним узлом
    // параметр node - вершина для изменения положения
    rotateLeft(node) {
        // правый дочерний узел - новая вершина
        const vertex = node.right;

        // создаем новый правый дочерний узел для вершины узла
        node.right = vertex.left;
        if (vertex.left != this.leaf) {
            vertex.left.parent = node;
        }

        // заменяем вершину новым узлом
        vertex.parent = node.parent;

        // если узел - корень, то заменяем корень
        if (!node.parent) {
            this.root = vertex;
        }
        else if (node === node.parent.left) {
            node.parent.left = vertex;
        }
        else {
            node.parent.right = vertex;
        }

        // устанавливаем левый дочерний узел для вершины узла
        vertex.left = node;
        node.parent = vertex;
    }


    // метод изменения положения узлов на правое:
    // дочерний узел станет новой вершиной,
    // предыдущая вершин становится правым дочерним узлом
    // параметр node - вершина для изменения положения
    rotateRight(node) {
        // левый дочерний узел - новая вершина
        const vertex = node.left;

        // вершина теряет левый дочерний узел, заменяем его правым дочерним узлом из новой вершины
        node.left = vertex.right;
        if (vertex.right != this.leaf) {
            vertex.right.parent = node;
        }

        // новая вершина заменяет старый узел
        vertex.parent = node.parent;
        if (!node.parent) {
            this.root = vertex;
        }
        else if (node == node.parent.right) {
            node.parent.right = vertex;
        }
        else {
            node.parent.left = vertex;
        }

        // добавляем правый дочерний узел к новой вершине
        vertex.right = node;
        node.parent = vertex;
    }


    // метод отображения узлов в глубину
    printRedBlackTree() {
        const stack = [
            { node: this.root, str: '' },
        ];

        while (stack.length) {
            // берем последний узел в стаке
            const item = stack.pop();

            // не печатаем пустые
            if (item.node == this.leaf) {
                continue;
            }

            let position = '';
            if (item.node.parent) {
                position = item.node === item.node.parent.left ? 'L----' : 'R----';
            }
            else {
                position = 'ROOT-';
            }

            // вывод информации об узле
            console.log(`${item.str}${position} ${item.node.key} (${item.node.color})`);

            // добавим дочерние узлы в стек
            stack.push({ node: item.node.right, str: item.str + '     ' });
            stack.push({ node: item.node.left, str: item.str + ' |   ' });

        }
    }


    // поиск минимального значения в поддереве
    // параметр node - узел, в котором мы должны искать минимальное значение
    minimum(node) {
        while (node.left != this.leaf) {
            node = node.left;
        }
        return node;
    }


    // удаление узла по значению
    // если у узла только 1 дочерний узел, заменяем данный узел дочерним узлом
    // если у узла есть оба дочерних узла, находим минимальный дочерний узел в правой части
    // используем его для замены узла
    // параметр key - значение узла, который должен быть удален
    deleteNode(key) {
        let forRemove = this.leaf;
        let tmp = this.root;

        while (tmp != this.leaf) {
            if (tmp.key === key) {
                forRemove = tmp;
                break;
            }

            if (tmp.key > key) {
                tmp = tmp.left;
            }
            else {
                tmp = tmp.right;
            }
        }

        // если узел не найден
        if (forRemove == this.leaf) {
            console.log('узел не найден');
            return;
        }

        let minRight = forRemove;
        let minRightColor = minRight.color;
        let newMinRight;

        // если узел для удаления не имеет левого дочернего узла, заменяем его правым дочерним узлом
        if (forRemove.left == this.leaf) {
            newMinRight = forRemove.right;
            this.replace(forRemove, forRemove.right);
        }
        // если у узла для удаления нет правого дочернего узла, заменяем его левым дочерним узлом
        else if (forRemove.right == this.leaf) {
            newMinRight = forRemove.left;
            this.replace(forRemove, forRemove.left);
        }

        // если узел для удаления имеет оба дочерних узла
        else {
            minRight = this.minimum(forRemove.right);
            minRightColor = minRight.color;
            newMinRight = minRight.right;

            if (minRight.parent === forRemove) {
                newMinRight.parent = minRight;
            }


            // заменим минимальное значение правой части дерева правым дочерним узлом,
            // установим правый дочерний узел из узла для удаления в минимальное значение правой части дерева
            else {
                this.replace(minRight, minRight.right);
                minRight.right = forRemove.right;
                minRight.right.parent = minRight;
            }

            // установим левые дочерние узлы узла для удаления в минимальные правой части дерева
            this.replace(forRemove, minRight);
            minRight.left = forRemove.left;
            minRight.left.parent = minRight;
            minRight.color = forRemove.color;
        }

        if (minRightColor === colors.black) {
            // балансировка дерева
            this.balanceDelete(newMinRight);
        }
    }


    // метод балансировки дерева после удаления:
    // 1) произвести балансировку дерева пока узел не является корнем дерева и цвет узла черный
    // 2) если узел является левым дочерним узлом родителя:
    //      а) если брат узла красный, установим цвет брата в черный, установите цвет родителя в красный
    //      изменим положение родителя на левое, установите правый дочерний узел родителя, как брата
    //      б) если дети брата черные, установите цвет брата в красный и применим балансировку к родителю узла
    //      в) если цвет одного из детей брата красный:
    //          если цвет правого дочернего узла брата черный, установить цвет левого дочернего узла в черный
    //          установить цвет брата в красный, изменить положение брата на правое,
    //          установить правый дочерний узел родителя, как брата
    //          установить цвет брата равным родительскому цвету, установить цвет родителя в черный,
    //          установить цвет правого дочернего узла брата в черный
    //          изменить положение родительского узла на левое
    //          установить корень дерева в качестве узла
    // 3) если узел - правый дочерний узел, а его брат - левый дочерний узел
    //      а) если цвет брата - красный
    //      установить цвет брата в черный, установить цвет родителя в красный,
    //      изменить положение родительского узла на правое и назначить левый дочерний узел родителя - братом
    //      б) если оба ребенка брата черные
    //      установить цвет брата в красный и применить балансировку к родителю
    //      в) если один из детей брата - красный
    //      если левый дочерний узел брата - черный, установить цвет правого дочернего узла брата в черный,
    //      установить цвет брата в красный, изменить положение брата на левое,
    //      установить левый дочерний узел родителя, как брата,
    //      установить цвет родителя в черный, установить цвет левого дочернего узла брата в черный,
    //      изменить положение родителя на правое
    //      установить корень в качестве узла
    // параметр node - узел для балансировки
    balanceDelete(node) {
        while (
                node != this.root &&
                node.color == colors.black
              ) {
            if (node == node.parent.left) {
                let brother = node.parent.right;

                if (brother.color == colors.red) {
                    brother.color = colors.black;
                    node.parent.color = colors.red;
                    this.rotateLeft(node.parent);
                    brother = node.parent.right;
                }

                if (
                    brother.left.color == colors.black &&
                    brother.right.color == colors.black
                ) {
                    brother.color = colors.red;
                    node = node.parent;
                }
                else {
                    if (brother.right.color == colors.black) {
                        brother.left.color = colors.black;
                        brother.color = colors.red;
                        this.rotateRight(brother);
                        brother = node.parent.right;
                    }

                    brother.color = node.parent.color;
                    node.parent.color = colors.black;
                    brother.right.color = colors.black;
                    this.rotateLeft(node.parent);
                    node = this.root;
                }
            }
            else {
                let brother = node.parent.left;
                if (brother.color == colors.red) {
                    brother.color = colors.black;
                    node.parent.color = colors.red;
                    this.rotateRight(node.parent);
                    brother = node.parent.left;
                }

                if (
                    brother.left.color == colors.black &&
                    brother.right.color == colors.black
                ) {
                    brother.color = colors.red;
                    node = node.parent;
                }
                else {
                    if (brother.left.color == colors.black) {
                        brother.right.color = colors.black;
                        brother.color = colors.red;
                        this.rotateLeft(brother);
                        brother = node.parent.left;
                    }

                    brother.color = node.parent.color;
                    node.parent.color = colors.black;
                    brother.left.color = colors.black;
                    this.rotateRight(node.parent);
                    node = this.root;
                }
            }
        }

        node.color = colors.black;
    }


    // замена старого узла на новый узел
    // параметр     oldNode - узел для замены
    //              newNode - узел, чье значение должно быть использовано вместо старого узла
    replace(oldNode, newNode) {
        if (!oldNode.parent) {
            this.root = newNode;
        } else if (oldNode == oldNode.parent.left) {
            oldNode.parent.left = newNode;
        } else {
            oldNode.parent.right = newNode;
        }
        newNode.parent = oldNode.parent;
    }

}

console.log('')
console.log('')
console.log('Красно-черное дерево')

const t = new redBlackTree();

for (let i = 1; i < 20; i++) {
    t.insertNode(i);
}
t.printRedBlackTree();



for (let i = 1; i < 20; i++) {
    if (i % 2 === 0) {
        t.deleteNode(i);
    }
}
t.printRedBlackTree();


