describe("NodeDebugger", function() {
  describe("CommandCenter", function() {
    before_each(function() {
      command_center          = ndb.CommandCenter;
      command_center.commands = ndb.Commands;
    });

    describe("parsing", function() {
      before_each(function() {
        out = "";

        ndb.Helpers.puts = function(t) {
          out += t;
        };
      });

      it("should return the RawWrite command when matching rw <some text>", function() {
        command_center.parse("rw {}").toString().should.equal([ndb.Commands.RawWrite, "{}"].toString());
      });

      it("should return the RawWrite command when matching any rw <some text>", function() {
        command_center.parse("rw {foo: bar}").toString().should.equal([ndb.Commands.RawWrite, "{foo: bar}"].toString());
      });

      it("should return the help command for 'help'", function() {
        command_center.parse("help").toString().should.equal([ndb.Commands.Help].toString());
      });

      it("should return the help command for 'h'", function() {
        command_center.parse("h").toString().should.equal([ndb.Commands.Help].toString());
      });

      it("should trim a command", function() {
        command_center.parse("      rw {foo: bar}         ").toString().should.equal([ndb.Commands.RawWrite, "{foo: bar}"].toString());
      });

      it("should parse l as a list command", function() {
        command_center.parse("l")[0].should.equal(ndb.Commands.List);
      });

      it("should parse 'list' as a list command", function() {
        command_center.parse("list")[0].should.equal(ndb.Commands.List);
      });

      it("should output the help command if it doesn't parse another command", function() {
        command_center.parse("asdfasdfasdfas").toString().should.equal([ndb.Commands.Help].toString());
      });

      it("should parse 'continue' as a continue command", function() {
        command_center.parse("continue")[0].should.equal(ndb.Commands.Continue);
      });

      it("should parse 'c' as a c command", function() {
        command_center.parse("c")[0].should.equal(ndb.Commands.Continue);
      });

      it("should parse 'b' as a break command", function() {
        command_center.parse("b")[0].should.equal(ndb.Commands.Break);
      });

      it("should parse 'break' as a break command", function() {
        var result = command_center.parse("break");

        result[0].should.equal(ndb.Commands.Break);
        result[1].filename.should.equal(undefined);
        result[1].lineNumber.should.equal(undefined);
      });

      it("should return a list of filename:linenumber when specified in that format", function() {
        var result = command_center.parse("break /foo/bar.js:10");

        result[0].should.equal(ndb.Commands.Break);
        result[1].filename.should.equal("/foo/bar.js");
        result[1].lineNumber.should.equal(10);
      });

      it("should return the null + linenumber when only a number is specified", function() {
        var result = command_center.parse("break 10");

        result[0].should.equal(ndb.Commands.Break);
        result[1].filename.should.equal(undefined);
        result[1].lineNumber.should.equal(10);
      });

      it("should parse version as the version", function() {
        var parse = command_center.parse("version");
        parse[0].should.equal(ndb.Commands.Version);
      });
    });

    describe("loop", function() {
      it("should set the connection of the commands object", function() {
        command_center.connection = {};

        command_center.loop();
        command_center.commands.connection.should.equal(command_center.connection);
      });

      it('should open stdio', function() {
        opened = false;

        mock_stdio.open = function() {
          opened = true;
        };

        command_center.loop();
        opened.should.be(true);
      });

      describe("storing a command", function() {
        it('should have the last command as null if no commands have been run', function() {
          command_center.lastCommand.should.equal(null);
        });

        it("should store the last command when parsed succesfully", function() {
          var continue_cmd = command_center.parse("c");
          command_center.lastCommand.should.equal(continue_cmd);
        });

        it("should reset the command when none found (after a successful parse)", function() {
          command_center.parse("c");
          command_center.parse("adfasdfasdfad");
          command_center.lastCommand.should.equal(null);
        });

        it("should run the last command if an empty string is given", function() {
          var continue_cmd = command_center.parse("c");
          command_center.parse("").should.equal(continue_cmd);
        });

        it("should not return the last command if there is no last command", function() {
          command_center.parse("")[0].should.equal(command_center.parse("asdfadf")[0]);
        });
      });
    });
  });
});
