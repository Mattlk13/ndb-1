require.paths.unshift('spec', '/Users/scotttaylor/.rvm/gems/ruby/1.8.6/gems/jspec-3.3.2/lib', 'lib');
require('jspec');
require('unit/spec.helper');

require.paths.unshift("./../lib");

JSpec
  .exec('spec/unit/spec.js')
  .exec('spec/unit/command_center.js')
  .exec('spec/unit/event_listener.js')
  .exec('spec/unit/commands/raw_write.js')
  .exec('spec/unit/commands/help.js')
  .run({ reporter: JSpec.reporters.Terminal, fixturePath: 'spec/fixtures' })
  .report();
