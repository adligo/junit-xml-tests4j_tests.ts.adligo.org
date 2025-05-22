// junitXml_tests.tests4j.ts.adligo.org/src/junitXmlTests.mts


/**
 * Copyright 2023 Adligo Inc / Scott Morgan
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ApiTrial, AssertionContext, Test, TestResult, TrialSuite } from './tests4ts.ts.adligo.org@slink/tests4ts.mjs';
import { JUnitXmlGenerator } from './junitXml.tests4j.ts.adligo.org@slink/junitXmlTests4jGenerator.mjs';

/**
 * Tests for the JUnitXmlGenerator
 */
class JUnitXmlGeneratorTrial extends ApiTrial {
  constructor() {
    super('JUnitXmlGeneratorTrial', [
      new Test('testGenerateXmlBasic', (ac: AssertionContext) => {
        // Create a mock trial with passing tests
        const mockTest1 = new Test('testToExponent2to8()', (ac) => {});
        const mockTest2 = new Test('testToExponent16to64()', (ac) => {});
        
        const mockTrial = new ApiTrial('org.adligo.collections.shared.common.Base2ExponentsSourceFileTrial', [mockTest1, mockTest2]);
        
        // Run the tests to populate results
        mockTrial.run();
        
        // Generate XML
        const generator = new JUnitXmlGenerator();
        const xml = generator.generateXml(mockTrial, 'WHITESNAKE');
        
        // Verify XML structure
        ac.isTrue(xml.includes('<?xml version="1.0" encoding="UTF-8"?>'), 'XML should have XML declaration');
        ac.isTrue(xml.includes('<testsuite name="org.adligo.collections.shared.common.Base2ExponentsSourceFileTrial"'), 
          'XML should have testsuite element with correct name');
        ac.isTrue(xml.includes('tests="2"'), 'XML should show 2 tests');
        ac.isTrue(xml.includes('failures="0"'), 'XML should show 0 failures');
        ac.isTrue(xml.includes('hostname="WHITESNAKE"'), 'XML should have correct hostname');
        ac.isTrue(xml.includes('<testcase name="testToExponent2to8()"'), 'XML should include first test');
        ac.isTrue(xml.includes('<testcase name="testToExponent16to64()"'), 'XML should include second test');
      }),
      
      new Test('testGenerateXmlWithFailures', (ac: AssertionContext) => {
        // Create a mock trial with a failing test
        const mockTest1 = new Test('testPass', (ac) => {});
        const mockTest2 = new Test('testFail', (ac) => { throw new Error('Test failure message'); });
        
        const mockTrial = new ApiTrial('org.adligo.example.FailingTrial', [mockTest1, mockTest2]);
        
        // Run the tests to populate results
        mockTrial.run();
        
        // Generate XML
        const generator = new JUnitXmlGenerator();
        const xml = generator.generateXml(mockTrial);
        
        // Verify XML structure
        ac.isTrue(xml.includes('failures="1"'), 'XML should show 1 failure');
        ac.isTrue(xml.includes('<failure message="Error: Test failure message"'), 
          'XML should include failure message');
      }),
      
      new Test('testExtractClassName', (ac: AssertionContext) => {
        const generator = new JUnitXmlGenerator();
        
        // Use private method via any type
        const anyGenerator = generator as any;
        
        // Test with various formats
        ac.same('org.adligo.example.TestClass', 
                anyGenerator.extractClassName('org.adligo.example.TestClass.testMethod()'));
        
        ac.same('TestClass', 
                anyGenerator.extractClassName('TestClass.testMethod()'));
                
        ac.same('SimpleTest', 
                anyGenerator.extractClassName('SimpleTest'));
      })
    ]);
  }
}


// Run the trial
const trial = new JUnitXmlGeneratorTrial();
const suite = new TrialSuite('JUnit XML Generator Tests', [trial]);
suite.run().printTextReport().printTestReportFiles(new JUnitXmlGenerator());