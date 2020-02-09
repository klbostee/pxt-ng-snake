let delay: number

basic.showIcon(IconNames.Snake)
while (true) {
    if (input.buttonIsPressed(Button.A)) {
        delay = 500
        break
    } else if (input.buttonIsPressed(Button.B)) {
        delay = 250
        break
    }
}
basic.clearScreen()
basic.pause(1000)

radio.setGroup(23)

let snake: game.LedSprite[] = [game.createSprite(2, 2)]
let tail: game.LedSprite[] = []

let food: game.LedSprite = game.createSprite(Math.randomRange(0, 4), Math.randomRange(0, 4))
food.set(LedSpriteProperty.Blink, 1)
food.set(LedSpriteProperty.Brightness, 3)

input.onButtonPressed(Button.A, function () {
    snake[0].turn(Direction.Left, 90)
})
input.onButtonPressed(Button.B, function () {
    snake[0].turn(Direction.Right, 90)
})

ng.onButtonPressed(ng.NGButtonPin.Up, function () {
    snake[0].set(LedSpriteProperty.Direction, 0)
})
ng.onButtonPressed(ng.NGButtonPin.Right, function () {
    snake[0].set(LedSpriteProperty.Direction, 90)
})
ng.onButtonPressed(ng.NGButtonPin.Down, function () {
    snake[0].set(LedSpriteProperty.Direction, 180)
})
ng.onButtonPressed(ng.NGButtonPin.Left, function () {
    snake[0].set(LedSpriteProperty.Direction, 270)
})

kermis.onKermisNotePlayed(function () {
    ng.neopixels().rotate(1)
    ng.neopixels().show()
})

basic.forever(function () {
    // move snake
    let prevSprite: game.LedSprite = null
    let currentSprite: game.LedSprite = null
    for (let index = 0; index <= snake.length - 2; index++) {
        currentSprite = snake[snake.length - index - 1]
        prevSprite = snake[snake.length - index - 2]
        currentSprite.set(LedSpriteProperty.X, prevSprite.get(LedSpriteProperty.X))
        currentSprite.set(LedSpriteProperty.Y, prevSprite.get(LedSpriteProperty.Y))
    }
    let prevX = snake[0].get(LedSpriteProperty.X)
    let prevY = snake[0].get(LedSpriteProperty.Y)
    snake[0].move(1)
    if (snake[0].get(LedSpriteProperty.X) == prevX && snake[0].get(LedSpriteProperty.Y) == prevY) {
        game.gameOver()
    }
    basic.pause(delay)

    // check for collisions
    for (let index = 0; index <= snake.length - 2; index++) {
        let curSprite = snake[snake.length - index - 1]
        if (curSprite.isTouching(snake[0])) {
            game.gameOver()
        }
    }

    // eat food
    if (food.isTouching(snake[0])) {
        let newTail = game.createSprite(
            food.get(LedSpriteProperty.X),
            food.get(LedSpriteProperty.Y)
        )
        newTail.set(LedSpriteProperty.Brightness, 5)
        snake.push(newTail)
        food.set(LedSpriteProperty.X, Math.randomRange(0, 4))
        food.set(LedSpriteProperty.Y, Math.randomRange(0, 4))
        game.addScore(1)
        radio.sendNumber(game.score())
        if (game.score() == 10) {
            // woohoo!
            game.pause() // pause rendering engine
            input.onButtonPressed(Button.A, function () {
                ng.neopixels().showRainbow(1, 360)
                kermis.playFirstPartOfKermisChorus()
                ng.neopixels().showColor(neopixel.colors(NeoPixelColors.Black))
                ng.neopixels().show()
            })
            input.onButtonPressed(Button.B, function () {
                ng.neopixels().showRainbow(1, 360)
                kermis.playSecondPartOfKermisChorus()
                ng.neopixels().showColor(neopixel.colors(NeoPixelColors.Black))
                ng.neopixels().show()
            })
            basic.clearScreen()
            let count = 0;
            while (true) {
                count += 1
                if (count % 2 == 0) {
                    basic.showIcon(IconNames.SmallHeart)
                } else {
                    basic.showIcon(IconNames.Heart)
                }
                basic.pause(100);
            }
        }
    }
})