# 3308proj

# Project Title: Heart-a-tracker

# Team member’s names
> * Chris Powell
> * Adam Laughlin
> * Ben Wilson
> * Brian Solar

# Vision statement: what would you tell potential customers?
Predict future heart behavior.

# Motivation: why are you working on this project?
This project combines the interests of our group into one cohesive idea.

#  Risks and Mitigation Strategies:
> * __Risk__: No prior experience working with these team members impacting our success.
> * __Mitigation Strategy__: Start with some ice breakers, share experiences from previous classes,
find a shared goal we can all get behind


> * __Risk__: Schedules interfering
> * __Mitigation Strategy__: Find a backup time to meet in case we can't meet at the normal scheduled
time. We can also meet without someone if they can meet with a group member before hand.
If we can project manage well enough we can have our meeting without someone


> * __Risk__: Not learning the necessary tools/skills in time:
Pytorch, etc.
> * ____Mitigation Strategy____:
Fall back on simpler APIs, such as Keras/sklearn
Use tools that are in one’s experience


> * __Risk__: Not having the necessary tools/frameworks available:
Backend not supporting Pytorch
> * __Mitigation Strategy__:
Fall back on simpler APIs, or ones that are supported
Adapt the problem to one that can be accomplished with the available tools


> * __Risk__: Not having the necessary data
Heart rate data (clean) over a period of time
> * __Mitigation Strategy__:
Synthetically generate our own data
Use publicly available data (such as on Kaggle or university research websites)


> * __Risk__: One member not completing a task required for the group to move forward
> * __Mitigation Strategy__:
Have each story assigned to two members (one primary, one secondary) to encourage accountability
Have early deadlines for completion, allowing an assessment on progression and follow-up action to push for a timely completion


> * __Risk__: Lack of access to test devices
Building for iOS or Android with only some team members having access
> * __Mitigation Strategy__:
Discuss what device we all have access to, possibly loading it onto our roommate’s phone to be able to complete stories on our own
Look for software that acts like a mobile OS as an environment


> * __Risk__: Spending too much time at any point in the development
Creating too many stories or spending too many resources in a section that creates a limited amount of time for the other areas
> * __Mitigation Strategy__:
Estimate the number of days and hours we have in total and attempt to assign portions of development to stages of the process, i.e. 10% to UI, 10% to data pipeline, 50% to neural network algorithm and improvements to it, etc…
Attempt to project manage on a larger scale before breaking it down into stories and sprints, understanding when we need to take the actions outlined above because we no longer have time to spend on that part of the project.


> * __Risk__: Different data collecting devices and data formats
Apple Watch, Garmin, FitBit, Jawbone, etc, with different data types
> * __Mitigation Strategy__:
This could be luxury if we aren’t able to find time for it.
Try to find an intermediary, such as Apple’s Health app, who already transforms and stores the data


## Building/Testing
### Building and Testing All Project Parts (should be done before every push)
```
$ cd <your dir>/3308proj
$ python
>>> from build import build_all_sequence,test_all_sequence
>>> build_all_sequence() && test_all_sequence()
```
### Building/Testing Mobile
TBD
### Building/Testing ML
TBD
### Building/Testing API
TBD


Fantastic. Saw you added them to the readme too.  I just added an initial build script and did some service integrations (slack, github, travis CI), and did some research on how best to set up the dev flow.  Also added an initial issue to break down for the PM flow, and labels, and ... found a gaping hole in all the milestones.  All the dev tooling, directory structures, etc., necessary to run the project as a whole, and its parts.  I'm getting the basics done, but we're each likely going to need to take parts of it.  Building/testing the mobile parts, for example, will differ greatly from the ML parts, and we all need to know how to do each of them.  Additional documentation needs there, or perhaps training over conference if that's more efficient.
