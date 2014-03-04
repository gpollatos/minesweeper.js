;
(function (window) {
  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  function MineSweeperView(el) {
    var gridSize = $('#minesweeper_size').val();
    var mines = $('#minesweeper_mines').val();
    this.mineSweeper = new MineSweeper(gridSize, mines, el);
    this.mineSweeper.initialize();
    this.el = el;
  }

  MineSweeperView.prototype = {

    reset: function () {
      $('.minesweewer_table').remove();
      $('.red').remove();
      delete this.mineSweeper;
      var gridSize = $('#minesweeper_size').val();
      var mines = $('#minesweeper_mines').val();
      this.mineSweeper = new MineSweeper(gridSize, mines, this.el);
      this.mineSweeper.initialize();
    },

    render: function (reset) {
      this.renderGrid();
      this.setupListeners();
      $('#minesweeper_tries').val("" + this.mineSweeper.tries);
    },

    setupListeners: function () {
      $('.minesweeper_table_cell').each(function (index, element) {
        $(element).click(function (e) {
          var $cell = $(e.target);
          $cell.off('click');
          var col = $cell.index();
          var row = $cell.closest('tr').index();
          this.mineSweeper.steppedOn(row, col, function (isMine, tries) {
            if (isMine) {
              $cell.addClass("minesweeper_table_cell_boom");
            } else {
              $cell.addClass("minesweeper_table_cell_phew");
            }
            $('#minesweeper_tries').val("" + tries);
            if (tries === 0) {
              this.destroy(isMine);
            }
          }.bind(this));
        }.bind(this));
      }.bind(this));
    },

    renderGrid: function () {
      var table = $('<table></table>').addClass("minesweewer_table");
      for (var i = 0; i < this.mineSweeper.n; ++i) {
        var row = $('<tr></tr>').attr({class: "minesweeper_table_row"}).appendTo(table);
        for (var j = 0; j < this.mineSweeper.n; ++j) {
          $('<td></td>').attr({class: "minesweeper_table_cell"}).text(" ").css("width", 300 / this.mineSweeper.n + "px").css("height", 300 / this.mineSweeper.n + "px").appendTo(row);
        }
      }
      table.appendTo(this.el);
    },

    destroy: function (steppedOnMine) {
      $('.minesweeper_table_cell').each(function () {
        $(this).off('click');
      });
      if (steppedOnMine === true) {
        this.renderMessage("Try again?").appendTo(this.el);
      } else {
        this.renderMessage("Congrats!").appendTo(this.el);
      }
    },

    renderMessage: function (text) {
      var message = $('<p></p>').text(text);
      message.click(function () {
        $('#minesweeper_init_button').trigger('click');
      });
      return $('<div></div>').attr({id: "minesweeper-msg", class: "red"}).append(message);
    }
  };

  function MineSweeper(gridSize, mines, el) {
    this.el = el;
    this.n = parseInt(gridSize, 10);
    this.m = parseInt(mines, 10);
    this.mines = {};
    this.tries = 0;
  }

  MineSweeper.prototype = {

    steppedOn: function (row, col, callback) {
      var steppedOnMine = false;
      var index = row * this.n + col;
      this.tries--;
      if (this.mines[index]) {
        this.tries = 0;
        steppedOnMine = true;
      }
      callback(steppedOnMine, this.tries);
    },

    initialize: function () {
      var totalSquares = this.n * this.n;
      this.tries = totalSquares - this.m;
      var remainingMines = this.m;
      while (remainingMines > 0) {
        var mine = getRandomInt(0, totalSquares - 1);
        while (this.mines[mine] === true) {
          mine = getRandomInt(0, totalSquares - 1);
        }
        this.mines[mine] = true;
        --remainingMines;
      }
    }

  };

  (function startGame() {
    var mineSweeperView = undefined;
    var $initButton = $('#minesweeper_init_button');
    $initButton.click(function () {
      if (mineSweeperView) {
        mineSweeperView.reset();
      } else {
        mineSweeperView = new MineSweeperView($("#minesweewer"));
      }
      mineSweeperView.render();
    }.bind(this));
    $initButton.click();
  })();

})(window);
